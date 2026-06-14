const admin = require("firebase-admin");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

admin.initializeApp();

const db = admin.firestore();
const telegramBotToken = defineSecret("TELEGRAM_BOT_TOKEN");
const telegramChatId = defineSecret("TELEGRAM_CHAT_ID");
const telegramWebhookSecret = defineSecret("TELEGRAM_WEBHOOK_SECRET");
const telegramAllowedChatId = defineSecret("TELEGRAM_ALLOWED_CHAT_ID");

const STATUS_LABELS = {
  new: "Нове",
  processing: "В обробці",
  done: "Виконано",
  cancelled: "Скасовано",
};

const STATUS_EMOJI = {
  new: "🆕",
  processing: "🕐",
  done: "✅",
  cancelled: "❌",
};

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paymentLabel(payment) {
  switch (payment) {
    case "iban":
      return "Безготівковий розрахунок (IBAN)";
    case "pickup":
      return "Самовивіз + оплата в салоні";
    default:
      return payment || "Не вказано";
  }
}

function deliveryLabel(delivery) {
  switch (delivery) {
    case "pickup":
      return "Самовивіз із салону";
    case "np":
      return "Нова пошта";
    default:
      return delivery || "Не вказано";
  }
}

function statusLabel(status) {
  return STATUS_LABELS[status] || "Не вказано";
}

function statusEmoji(status) {
  return STATUS_EMOJI[status] || "ℹ️";
}

function formatOrderItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Товари: не знайдено";
  }

  const lines = items.map((item, index) => {
    const brand = item.brand ? `${item.brand} ` : "";
    const title = item.title || "Без назви";
    const qty = item.qty || 1;
    const price = item.price ? `${item.price * qty} ₴` : "Ціна договірна";
    const comment = item.comment ? `\n   ${item.comment}` : "";

    return `• ${index + 1}. ${brand}${title}\n   К-сть: ${qty}\n   Сума: ${price}${comment}`;
  });

  return lines.join("\n\n");
}

function formatAddress(delivery = {}) {
  if (delivery.method !== "np") {
    return "Не потрібна";
  }

  const city = delivery.city || "Не вказано місто";
  const warehouse = delivery.warehouse || "Не вказано відділення";
  return `${city}, ${warehouse}`;
}

function formatCreatedAt(createdAt) {
  try {
    if (!createdAt) return "";
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Kiev",
    }).format(date);
  } catch {
    return "";
  }
}

function buildInlineKeyboard(orderId, currentStatus) {
  const statuses = [
    ["processing", "В обробці"],
    ["done", "Виконано"],
    ["cancelled", "Скасовано"],
  ];

  return {
    inline_keyboard: [
      statuses.map(([status, label]) => ({
        text: currentStatus === status ? `• ${label}` : label,
        callback_data: `status|${orderId}|${status}`,
      })),
    ],
  };
}

function buildConfirmationKeyboard(orderId, nextStatus) {
  return {
    inline_keyboard: [
      [
        {
          text: `Так, ${STATUS_LABELS[nextStatus].toLowerCase()}`,
          callback_data: `confirm|${orderId}|${nextStatus}`,
        },
        {
          text: "Ні, назад",
          callback_data: `cancel_confirm|${orderId}|keep`,
        },
      ],
    ],
  };
}

function buildOrderMessage(order, orderId) {
  const customer = order.customer || {};
  const delivery = order.delivery || {};
  const displayOrderId = order.orderNumber || orderId;
  const createdAt = formatCreatedAt(order.createdAt);
  const status = order.status || "new";

  return [
    "🛒 <b>Нове замовлення BOVE</b>",
    "",
    `<b>Номер:</b> ${escapeHtml(displayOrderId)}`,
    createdAt ? `<b>Дата:</b> ${escapeHtml(createdAt)}` : null,
    `<b>Статус:</b> ${escapeHtml(`${statusEmoji(status)} ${statusLabel(status)}`)}`,
    "",
    "<b>Клієнт</b>",
    `${escapeHtml(`${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Не вказано")}`,
    `📞 ${escapeHtml(customer.phone || "Не вказано")}`,
    `✉️ ${escapeHtml(customer.email || "Не вказано")}`,
    "",
    "<b>Доставка</b>",
    `${escapeHtml(deliveryLabel(delivery.method))}`,
    `📍 ${escapeHtml(formatAddress(delivery))}`,
    "",
    "<b>Оплата</b>",
    `${escapeHtml(paymentLabel(order.payment))}`,
    "",
    `<b>Разом:</b> ${escapeHtml(order.totalLabel || "Не вказано")}`,
    "",
    "<b>Товари</b>",
    escapeHtml(formatOrderItems(order.items)),
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCollapsedOrderMessage(order, orderId) {
  const customer = order.customer || {};
  const delivery = order.delivery || {};
  const displayOrderId = order.orderNumber || orderId;
  const status = order.status || "new";

  return [
    `${statusEmoji(status)} <b>${escapeHtml(statusLabel(status))}</b>`,
    `<b>Номер:</b> ${escapeHtml(displayOrderId)}`,
    `<b>Клієнт:</b> ${escapeHtml(`${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Не вказано")}`,
    `<b>Телефон:</b> ${escapeHtml(customer.phone || "Не вказано")}`,
    `<b>Доставка:</b> ${escapeHtml(deliveryLabel(delivery.method))}`,
    `<b>Разом:</b> ${escapeHtml(order.totalLabel || "Не вказано")}`,
  ].join("\n");
}

function isCollapsedStatus(status) {
  return status === "done" || status === "cancelled";
}

async function callTelegramApi(method, payload, botToken) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram ${method} failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

async function syncTelegramOrderMessage(order, orderId, botToken) {
  const chatId = order.telegram?.chatId;
  const messageId = order.telegram?.messageId;

  if (!chatId || !messageId) {
    return;
  }

  const nextStatus = order.status || "new";

  await callTelegramApi(
    "editMessageText",
    {
      chat_id: chatId,
      message_id: messageId,
      text: isCollapsedStatus(nextStatus)
        ? buildCollapsedOrderMessage(order, orderId)
        : buildOrderMessage(order, orderId),
      parse_mode: "HTML",
      reply_markup: isCollapsedStatus(nextStatus)
        ? { inline_keyboard: [] }
        : buildInlineKeyboard(orderId, nextStatus),
    },
    botToken
  );
}

exports.notifyTelegramOnOrderCreate = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: "europe-west1",
    secrets: [telegramBotToken, telegramChatId],
  },
  async (event) => {
    const snapshot = event.data;

    if (!snapshot) {
      return;
    }

    const orderId = event.params.orderId;
    const order = snapshot.data() || {};
    const normalizedOrder = {
      ...order,
      status: order.status || "new",
    };

    const telegramResponse = await callTelegramApi(
      "sendMessage",
      {
        chat_id: telegramChatId.value(),
        text: buildOrderMessage(normalizedOrder, orderId),
        parse_mode: "HTML",
        reply_markup: buildInlineKeyboard(orderId, normalizedOrder.status),
      },
      telegramBotToken.value()
    );

    await snapshot.ref.update({
      status: normalizedOrder.status,
      telegram: {
        chatId: telegramResponse.result?.chat?.id || null,
        messageId: telegramResponse.result?.message_id || null,
      },
    });
  }
);

exports.syncTelegramOnOrderStatusUpdate = onDocumentUpdated(
  {
    document: "orders/{orderId}",
    region: "europe-west1",
    secrets: [telegramBotToken],
  },
  async (event) => {
    const beforeData = event.data?.before?.data() || null;
    const afterData = event.data?.after?.data() || null;

    if (!beforeData || !afterData) {
      return;
    }

    if (beforeData.status === afterData.status) {
      return;
    }

    if (afterData.statusUpdatedSource === "telegram") {
      return;
    }

    await syncTelegramOrderMessage(afterData, event.params.orderId, telegramBotToken.value());
  }
);

exports.telegramWebhook = onRequest(
  {
    region: "europe-west1",
    secrets: [telegramBotToken, telegramWebhookSecret, telegramAllowedChatId],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const headerSecret = req.get("x-telegram-bot-api-secret-token");
    if (headerSecret !== telegramWebhookSecret.value()) {
      res.status(403).send("Forbidden");
      return;
    }

    const callbackQuery = req.body?.callback_query;

    if (!callbackQuery) {
      res.status(200).json({ ok: true });
      return;
    }

    const allowedChatId = String(telegramAllowedChatId.value());
    const callbackChatId = String(callbackQuery.message?.chat?.id || "");

    if (callbackChatId !== allowedChatId) {
      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Ця дія недоступна в цьому чаті",
        },
        telegramBotToken.value()
      );
      res.status(200).json({ ok: true });
      return;
    }

    const callbackData = callbackQuery.data || "";
    const [action, orderId, nextStatus] = callbackData.split("|");

    if (!orderId) {
      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Некоректна дія",
        },
        telegramBotToken.value()
      );
      res.status(200).json({ ok: true });
      return;
    }

    const orderRef = db.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Замовлення не знайдено",
        },
        telegramBotToken.value()
      );
      res.status(200).json({ ok: true });
      return;
    }

    const currentOrder = orderSnap.data() || {};

    if (action === "cancel_confirm") {
      await callTelegramApi(
        "editMessageText",
        {
          chat_id: callbackQuery.message.chat.id,
          message_id: callbackQuery.message.message_id,
          text: buildOrderMessage(currentOrder, orderId),
          parse_mode: "HTML",
          reply_markup: buildInlineKeyboard(orderId, currentOrder.status || "new"),
        },
        telegramBotToken.value()
      );

      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Скасовано підтвердження",
        },
        telegramBotToken.value()
      );

      res.status(200).json({ ok: true });
      return;
    }

    if (action === "status") {
      if (!STATUS_LABELS[nextStatus]) {
        await callTelegramApi(
          "answerCallbackQuery",
          {
            callback_query_id: callbackQuery.id,
            text: "Некоректна дія",
          },
          telegramBotToken.value()
        );
        res.status(200).json({ ok: true });
        return;
      }

      if (nextStatus === "done" || nextStatus === "cancelled") {
        await callTelegramApi(
          "editMessageReplyMarkup",
          {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: buildConfirmationKeyboard(orderId, nextStatus),
          },
          telegramBotToken.value()
        );

        await callTelegramApi(
          "answerCallbackQuery",
          {
            callback_query_id: callbackQuery.id,
            text: `Підтвердити: ${statusLabel(nextStatus)}?`,
          },
          telegramBotToken.value()
        );

        res.status(200).json({ ok: true });
        return;
      }
    }

    if (action !== "status" && action !== "confirm") {
      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Некоректна дія",
        },
        telegramBotToken.value()
      );
      res.status(200).json({ ok: true });
      return;
    }

    if (!STATUS_LABELS[nextStatus]) {
      await callTelegramApi(
        "answerCallbackQuery",
        {
          callback_query_id: callbackQuery.id,
          text: "Некоректний статус",
        },
        telegramBotToken.value()
      );
      res.status(200).json({ ok: true });
      return;
    }

    const updatedOrder = {
      ...currentOrder,
      status: nextStatus,
    };

    await orderRef.update({
      status: nextStatus,
      statusUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      statusUpdatedSource: "telegram",
    });

    await syncTelegramOrderMessage(
      {
        ...updatedOrder,
        telegram: currentOrder.telegram || {
          chatId: callbackQuery.message.chat.id,
          messageId: callbackQuery.message.message_id,
        },
      },
      orderId,
      telegramBotToken.value()
    );

    await callTelegramApi(
      "answerCallbackQuery",
      {
        callback_query_id: callbackQuery.id,
        text: `Статус: ${statusLabel(nextStatus)}`,
      },
      telegramBotToken.value()
    );

    res.status(200).json({ ok: true });
  }
);
