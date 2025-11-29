
# WAHA API Function Catalog for OpenAI Tools

Bu sənəd WAHA (WhatsApp HTTP API) endpointlərini OpenAI funksiyaları kimi çağırmaq üçün tələb olunan strukturla təqdim edir. Hər bir bölüm HTTP metodu, sorğu parametrləri, cavab strukturu və OpenAI `function` obyektinə uyğun JSON sxemini ehtiva edir.

> Qeyd: Bütün sorğular `X-Api-Key: <WAHA_API_KEY>` header-i ilə autentifikasiya olunmalıdır.

## waha_AppsController_list

**Metod & Yol:** `GET /api/apps`

**Açıqlama:** List all apps for a session

**Sorğu Parametrləri:**
- `session` [query] (tələb olunur): Session name to list apps for

**OpenAI Function JSON:**
```json
{
  "name": "waha_AppsController_list",
  "description": "List all apps for a session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "example": "default",
        "type": "string",
        "description": "Location: query | Session name to list apps for"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_AppsController_create

**Metod & Yol:** `POST /api/apps`

**Açıqlama:** Create a new app

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable or disable this app without deleting it. If omitted, treated as enabled (true)."
    },
    "id": {
      "type": "string"
    },
    "session": {
      "type": "string"
    },
    "app": {
      "type": "string",
      "enum": [
        "chatwoot"
      ]
    },
    "config": {
      "type": "object"
    }
  },
  "required": [
    "id",
    "session",
    "app",
    "config"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_AppsController_create",
  "description": "Create a new app",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "enabled": {
            "type": "boolean",
            "default": true,
            "description": "Enable or disable this app without deleting it. If omitted, treated as enabled (true)."
          },
          "id": {
            "type": "string"
          },
          "session": {
            "type": "string"
          },
          "app": {
            "type": "string",
            "enum": [
              "chatwoot"
            ]
          },
          "config": {
            "type": "object"
          }
        },
        "required": [
          "id",
          "session",
          "app",
          "config"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChatwootLocalesController_getLanguages

**Metod & Yol:** `GET /api/apps/chatwoot/locales`

**Açıqlama:** Get available languages for Chatwoot app

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object"
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatwootLocalesController_getLanguages",
  "description": "Get available languages for Chatwoot app",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_AppsController_delete

**Metod & Yol:** `DELETE /api/apps/{id}`

**Açıqlama:** Delete an app

**Sorğu Parametrləri:**
- `id` [path] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_AppsController_delete",
  "description": "Delete an app",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "id"
    ]
  }
}
```

## waha_AppsController_get

**Metod & Yol:** `GET /api/apps/{id}`

**Açıqlama:** Get app by ID

**Sorğu Parametrləri:**
- `id` [path] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_AppsController_get",
  "description": "Get app by ID",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "id"
    ]
  }
}
```

## waha_AppsController_update

**Metod & Yol:** `PUT /api/apps/{id}`

**Açıqlama:** Update an existing app

**Sorğu Parametrləri:**
- `id` [path] (tələb olunur): 

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "enabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable or disable this app without deleting it. If omitted, treated as enabled (true)."
    },
    "id": {
      "type": "string"
    },
    "session": {
      "type": "string"
    },
    "app": {
      "type": "string",
      "enum": [
        "chatwoot"
      ]
    },
    "config": {
      "type": "object"
    }
  },
  "required": [
    "id",
    "session",
    "app",
    "config"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_AppsController_update",
  "description": "Update an existing app",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Location: path"
      },
      "body": {
        "type": "object",
        "properties": {
          "enabled": {
            "type": "boolean",
            "default": true,
            "description": "Enable or disable this app without deleting it. If omitted, treated as enabled (true)."
          },
          "id": {
            "type": "string"
          },
          "session": {
            "type": "string"
          },
          "app": {
            "type": "string",
            "enum": [
              "chatwoot"
            ]
          },
          "config": {
            "type": "object"
          }
        },
        "required": [
          "id",
          "session",
          "app",
          "config"
        ]
      }
    },
    "required": [
      "body",
      "id"
    ]
  }
}
```

## waha_ChattingController_DEPRECATED_checkNumberStatus

**Metod & Yol:** `GET /api/checkNumberStatus`

**Açıqlama:** Check number status

**Ətraflı:** DEPRECATED. Use "POST /contacts/check-exists" instead

**Sorğu Parametrləri:**
- `phone` [query] (tələb olunur): The phone number to check
- `session` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "Chat id for the phone number. Undefined if the number does not exist"
    },
    "numberExists": {
      "type": "boolean"
    }
  },
  "required": [
    "numberExists"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_DEPRECATED_checkNumberStatus",
  "description": "Check number status",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "example": "1213213213",
        "type": "string",
        "description": "Location: query | The phone number to check"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "phone",
      "session"
    ]
  }
}
```

## waha_ContactsController_get

**Metod & Yol:** `GET /api/contacts`

**Açıqlama:** Get contact basic info

**Ətraflı:** The method always return result, even if the phone number is not registered in WhatsApp. For that - use /contacts/check-exists endpoint below.

**Sorğu Parametrləri:**
- `contactId` [query] (tələb olunur): 
- `session` [query] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_get",
  "description": "Get contact basic info",
  "parameters": {
    "type": "object",
    "properties": {
      "contactId": {
        "example": "11111111111@c.us",
        "type": "string",
        "description": "Location: query"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "contactId",
      "session"
    ]
  }
}
```

## waha_ContactsController_getAbout

**Metod & Yol:** `GET /api/contacts/about`

**Açıqlama:** Gets the Contact's "about" info

**Ətraflı:** Returns null if you do not have permission to read their status.

**Sorğu Parametrləri:**
- `contactId` [query] (tələb olunur): 
- `session` [query] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_getAbout",
  "description": "Gets the Contact's \"about\" info",
  "parameters": {
    "type": "object",
    "properties": {
      "contactId": {
        "example": "11111111111@c.us",
        "type": "string",
        "description": "Location: query"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "contactId",
      "session"
    ]
  }
}
```

## waha_ContactsController_getAll

**Metod & Yol:** `GET /api/contacts/all`

**Açıqlama:** Get all contacts

**Sorğu Parametrləri:**
- `session` [query] (tələb olunur): 
- `sortBy` [query]: Sort by field
- `sortOrder` [query]: Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
- `limit` [query]: 
- `offset` [query]: 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_getAll",
  "description": "Get all contacts",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      },
      "sortBy": {
        "enum": [
          "id",
          "name"
        ],
        "type": "string",
        "description": "Location: query | Sort by field"
      },
      "sortOrder": {
        "enum": [
          "desc",
          "asc"
        ],
        "type": "string",
        "description": "Location: query | Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)"
      },
      "limit": {
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ContactsController_block

**Metod & Yol:** `POST /api/contacts/block`

**Açıqlama:** Block contact

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "contactId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "contactId",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_block",
  "description": "Block contact",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "contactId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "contactId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ContactsController_checkExists

**Metod & Yol:** `GET /api/contacts/check-exists`

**Açıqlama:** Check phone number is registered in WhatsApp.

**Sorğu Parametrləri:**
- `phone` [query] (tələb olunur): The phone number to check
- `session` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "Chat id for the phone number. Undefined if the number does not exist"
    },
    "numberExists": {
      "type": "boolean"
    }
  },
  "required": [
    "numberExists"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_checkExists",
  "description": "Check phone number is registered in WhatsApp.",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "example": "1213213213",
        "type": "string",
        "description": "Location: query | The phone number to check"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "phone",
      "session"
    ]
  }
}
```

## waha_ContactsController_getProfilePicture

**Metod & Yol:** `GET /api/contacts/profile-picture`

**Açıqlama:** Get contact's profile picture URL

**Ətraflı:** If privacy settings do not allow to get the picture, the method will return null.

**Sorğu Parametrləri:**
- `contactId` [query] (tələb olunur): 
- `refresh` [query]: Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error
- `session` [query] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_getProfilePicture",
  "description": "Get contact's profile picture URL",
  "parameters": {
    "type": "object",
    "properties": {
      "contactId": {
        "example": "11111111111@c.us",
        "type": "string",
        "description": "Location: query"
      },
      "refresh": {
        "default": false,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "contactId",
      "session"
    ]
  }
}
```

## waha_ContactsController_unblock

**Metod & Yol:** `POST /api/contacts/unblock`

**Açıqlama:** Unblock contact

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "contactId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "contactId",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsController_unblock",
  "description": "Unblock contact",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "contactId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "contactId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_forwardMessage

**Metod & Yol:** `POST /api/forwardMessage`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "messageId": {
      "type": "string",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "messageId",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Message ID",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "timestamp": {
      "type": "number",
      "description": "Unix timestamp for when the message was created",
      "example": 1666943582
    },
    "from": {
      "type": "string",
      "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
      "example": "11111111111@c.us"
    },
    "fromMe": {
      "type": "boolean",
      "description": "Indicates if the message was sent by the current user"
    },
    "source": {
      "enum": [
        "api",
        "app"
      ],
      "type": "string",
      "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
      "example": "api"
    },
    "to": {
      "type": "string",
      "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
      "example": "11111111111@c.us"
    },
    "participant": {
      "type": "string",
      "description": "For groups - participant who sent the message"
    },
    "body": {
      "type": "string",
      "description": "Message content"
    },
    "hasMedia": {
      "type": "boolean",
      "description": "Indicates if the message has media available for download"
    },
    "media": {
      "description": "Media object for the message if any and downloaded",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "The URL for the media in the message if any",
              "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
            },
            "mimetype": {
              "type": "string",
              "description": "mimetype for the media in the message if any",
              "example": "audio/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "The original filename in mediaUrl in the message if any",
              "example": "example.pdf"
            },
            "s3": {
              "description": "S3 attributes for the media in the message if you are using S3 media storage",
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "Bucket": {
                      "type": "string",
                      "description": "The name of the S3 bucket",
                      "example": "my-bucket"
                    },
                    "Key": {
                      "type": "string",
                      "description": "The key of the object in the S3 bucket",
                      "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                    }
                  },
                  "required": [
                    "Bucket",
                    "Key"
                  ]
                }
              ]
            },
            "error": {
              "type": "object",
              "description": "Error message if there's an error downloading the media",
              "example": null
            }
          }
        }
      ]
    },
    "mediaUrl": {
      "type": "string",
      "description": "Use `media.url` instead! The URL for the media in the message if any",
      "deprecated": true,
      "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
    },
    "ack": {
      "enum": [
        -1,
        0,
        1,
        2,
        3,
        4
      ],
      "type": "number",
      "description": "ACK status for the message"
    },
    "ackName": {
      "type": "string",
      "description": "ACK status name for the message"
    },
    "author": {
      "type": "string",
      "description": "If the message was sent to a group, this field will contain the user that sent the message."
    },
    "location": {
      "description": "Location information contained in the message, if the message is type \"location\"",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "latitude": {
              "type": "string"
            },
            "longitude": {
              "type": "string"
            },
            "live": {
              "type": "boolean"
            },
            "name": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            }
          },
          "required": [
            "latitude",
            "longitude",
            "live"
          ]
        }
      ]
    },
    "vCards": {
      "description": "List of vCards contained in the message.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "_data": {
      "type": "object",
      "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
    },
    "replyTo": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Message ID",
          "example": "AAAAAAAAAAAAAAAAAAAA"
        },
        "participant": {
          "type": "string",
          "example": "11111111111@c.us"
        },
        "body": {
          "type": "string",
          "example": "Hello!"
        },
        "_data": {
          "type": "object",
          "description": "Raw data from reply's message"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  "required": [
    "id",
    "timestamp",
    "from",
    "fromMe",
    "source",
    "to",
    "participant",
    "body",
    "hasMedia",
    "mediaUrl",
    "ack",
    "ackName"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_forwardMessage",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "messageId": {
            "type": "string",
            "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "messageId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_getMessages

**Metod & Yol:** `GET /api/messages`

**Açıqlama:** Get messages in a chat

**Ətraflı:** DEPRECATED. Use "GET /api/chats/{id}/messages" instead

**Sorğu Parametrləri:**
- `sortBy` [query]: Sort by field
- `sortOrder` [query]: Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
- `downloadMedia` [query]: Download media for messages
- `chatId` [query] (tələb olunur): 
- `session` [query] (tələb olunur): 
- `limit` [query] (tələb olunur): 
- `offset` [query]: 
- `filter.timestamp.lte` [query]: Filter messages before this timestamp (inclusive)
- `filter.timestamp.gte` [query]: Filter messages after this timestamp (inclusive)
- `filter.fromMe` [query]: From me filter (by default shows all messages)
- `filter.ack` [query]: Filter messages by acknowledgment status

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Message ID",
        "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
      },
      "timestamp": {
        "type": "number",
        "description": "Unix timestamp for when the message was created",
        "example": 1666943582
      },
      "from": {
        "type": "string",
        "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
        "example": "11111111111@c.us"
      },
      "fromMe": {
        "type": "boolean",
        "description": "Indicates if the message was sent by the current user"
      },
      "source": {
        "enum": [
          "api",
          "app"
        ],
        "type": "string",
        "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
        "example": "api"
      },
      "to": {
        "type": "string",
        "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
        "example": "11111111111@c.us"
      },
      "participant": {
        "type": "string",
        "description": "For groups - participant who sent the message"
      },
      "body": {
        "type": "string",
        "description": "Message content"
      },
      "hasMedia": {
        "type": "boolean",
        "description": "Indicates if the message has media available for download"
      },
      "media": {
        "description": "Media object for the message if any and downloaded",
        "allOf": [
          {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "description": "The URL for the media in the message if any",
                "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
              },
              "mimetype": {
                "type": "string",
                "description": "mimetype for the media in the message if any",
                "example": "audio/jpeg"
              },
              "filename": {
                "type": "string",
                "description": "The original filename in mediaUrl in the message if any",
                "example": "example.pdf"
              },
              "s3": {
                "description": "S3 attributes for the media in the message if you are using S3 media storage",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "Bucket": {
                        "type": "string",
                        "description": "The name of the S3 bucket",
                        "example": "my-bucket"
                      },
                      "Key": {
                        "type": "string",
                        "description": "The key of the object in the S3 bucket",
                        "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                      }
                    },
                    "required": [
                      "Bucket",
                      "Key"
                    ]
                  }
                ]
              },
              "error": {
                "type": "object",
                "description": "Error message if there's an error downloading the media",
                "example": null
              }
            }
          }
        ]
      },
      "mediaUrl": {
        "type": "string",
        "description": "Use `media.url` instead! The URL for the media in the message if any",
        "deprecated": true,
        "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
      },
      "ack": {
        "enum": [
          -1,
          0,
          1,
          2,
          3,
          4
        ],
        "type": "number",
        "description": "ACK status for the message"
      },
      "ackName": {
        "type": "string",
        "description": "ACK status name for the message"
      },
      "author": {
        "type": "string",
        "description": "If the message was sent to a group, this field will contain the user that sent the message."
      },
      "location": {
        "description": "Location information contained in the message, if the message is type \"location\"",
        "allOf": [
          {
            "type": "object",
            "properties": {
              "latitude": {
                "type": "string"
              },
              "longitude": {
                "type": "string"
              },
              "live": {
                "type": "boolean"
              },
              "name": {
                "type": "string"
              },
              "address": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "thumbnail": {
                "type": "string"
              }
            },
            "required": [
              "latitude",
              "longitude",
              "live"
            ]
          }
        ]
      },
      "vCards": {
        "description": "List of vCards contained in the message.",
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "_data": {
        "type": "object",
        "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
      },
      "replyTo": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Message ID",
            "example": "AAAAAAAAAAAAAAAAAAAA"
          },
          "participant": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "body": {
            "type": "string",
            "example": "Hello!"
          },
          "_data": {
            "type": "object",
            "description": "Raw data from reply's message"
          }
        },
        "required": [
          "id"
        ]
      }
    },
    "required": [
      "id",
      "timestamp",
      "from",
      "fromMe",
      "source",
      "to",
      "participant",
      "body",
      "hasMedia",
      "mediaUrl",
      "ack",
      "ackName"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_getMessages",
  "description": "Get messages in a chat",
  "parameters": {
    "type": "object",
    "properties": {
      "sortBy": {
        "default": "timestamp",
        "enum": [
          "timestamp",
          "messageTimestamp"
        ],
        "type": "string",
        "description": "Location: query | Sort by field"
      },
      "sortOrder": {
        "enum": [
          "desc",
          "asc"
        ],
        "type": "string",
        "description": "Location: query | Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)"
      },
      "downloadMedia": {
        "default": true,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Download media for messages"
      },
      "chatId": {
        "example": "11111111111@c.us",
        "type": "string",
        "description": "Location: query"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      },
      "limit": {
        "default": 10,
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      },
      "filter.timestamp.lte": {
        "type": "number",
        "description": "Location: query | Filter messages before this timestamp (inclusive)"
      },
      "filter.timestamp.gte": {
        "type": "number",
        "description": "Location: query | Filter messages after this timestamp (inclusive)"
      },
      "filter.fromMe": {
        "type": "boolean",
        "description": "Location: query | From me filter (by default shows all messages)"
      },
      "filter.ack": {
        "enum": [
          "ERROR",
          "PENDING",
          "SERVER",
          "DEVICE",
          "READ",
          "PLAYED"
        ],
        "type": "string",
        "description": "Location: query | Filter messages by acknowledgment status"
      }
    },
    "required": [
      "chatId",
      "limit",
      "session"
    ]
  }
}
```

## waha_ChattingController_setReaction

**Metod & Yol:** `PUT /api/reaction`

**Açıqlama:** React to a message with an emoji

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "messageId": {
      "type": "string",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "reaction": {
      "type": "string",
      "description": "Emoji to react with. Send an empty string to remove the reaction",
      "example": "👍"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "messageId",
    "reaction",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_setReaction",
  "description": "React to a message with an emoji",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "messageId": {
            "type": "string",
            "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
          },
          "reaction": {
            "type": "string",
            "description": "Emoji to react with. Send an empty string to remove the reaction",
            "example": "👍"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "messageId",
          "reaction",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_reply

**Metod & Yol:** `POST /api/reply`

**Açıqlama:** DEPRECATED - you can set "reply_to" field when sending text, image, etc

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "text": {
      "type": "string",
      "default": "Hi there!"
    },
    "linkPreview": {
      "type": "boolean",
      "default": true
    },
    "linkPreviewHighQuality": {
      "type": "boolean",
      "default": false
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "text",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_reply",
  "description": "DEPRECATED - you can set \"reply_to\" field when sending text, image, etc",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "text": {
            "type": "string",
            "default": "Hi there!"
          },
          "linkPreview": {
            "type": "boolean",
            "default": true
          },
          "linkPreviewHighQuality": {
            "type": "boolean",
            "default": false
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "text",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ScreenshotController_screenshot

**Metod & Yol:** `GET /api/screenshot`

**Açıqlama:** No summary provided.

**Sorğu Parametrləri:**
- `session` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "mimetype": {
          "type": "string"
        },
        "data": {
          "type": "string"
        }
      },
      "required": [
        "mimetype",
        "data"
      ]
    }
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ScreenshotController_screenshot",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChattingController_sendButtonsReply

**Metod & Yol:** `POST /api/send/buttons/reply`

**Açıqlama:** Reply on a button message

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "replyTo": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "selectedDisplayText": {
      "type": "string"
    },
    "selectedButtonID": {
      "type": "string"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "selectedDisplayText",
    "selectedButtonID",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendButtonsReply",
  "description": "Reply on a button message",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "replyTo": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "selectedDisplayText": {
            "type": "string"
          },
          "selectedButtonID": {
            "type": "string"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "selectedDisplayText",
          "selectedButtonID",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendLinkCustomPreview

**Metod & Yol:** `POST /api/send/link-custom-preview`

**Açıqlama:** Send a text message with a CUSTOM link preview.

**Ətraflı:** You can use regular /api/sendText if you wanna send auto-generated link preview.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "text": {
      "type": "string",
      "default": "Check this out! https://github.com/",
      "description": "The text to send. MUST include the URL provided in preview.url"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "linkPreviewHighQuality": {
      "type": "boolean",
      "default": true
    },
    "preview": {
      "type": "object",
      "properties": {
        "image": {
          "oneOf": [
            {
              "type": "object",
              "properties": {
                "url": {
                  "type": "string",
                  "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                }
              }
            },
            {
              "type": "object",
              "properties": {
                "data": {
                  "type": "string",
                  "description": "Base64-encoded data of the file",
                  "example": "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"
                }
              }
            }
          ],
          "example": {
            "url": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
          }
        },
        "url": {
          "type": "string",
          "default": "https://github.com/"
        },
        "title": {
          "type": "string",
          "default": "Your Title"
        },
        "description": {
          "type": "string",
          "default": "Check this out, amazing!"
        }
      },
      "required": [
        "url",
        "title",
        "description"
      ]
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "text",
    "preview",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendLinkCustomPreview",
  "description": "Send a text message with a CUSTOM link preview.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "text": {
            "type": "string",
            "default": "Check this out! https://github.com/",
            "description": "The text to send. MUST include the URL provided in preview.url"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "linkPreviewHighQuality": {
            "type": "boolean",
            "default": true
          },
          "preview": {
            "type": "object",
            "properties": {
              "image": {
                "oneOf": [
                  {
                    "type": "object",
                    "properties": {
                      "url": {
                        "type": "string",
                        "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                      }
                    }
                  },
                  {
                    "type": "object",
                    "properties": {
                      "data": {
                        "type": "string",
                        "description": "Base64-encoded data of the file",
                        "example": "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"
                      }
                    }
                  }
                ],
                "example": {
                  "url": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                }
              },
              "url": {
                "type": "string",
                "default": "https://github.com/"
              },
              "title": {
                "type": "string",
                "default": "Your Title"
              },
              "description": {
                "type": "string",
                "default": "Check this out, amazing!"
              }
            },
            "required": [
              "url",
              "title",
              "description"
            ]
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "text",
          "preview",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendButtons

**Metod & Yol:** `POST /api/sendButtons`

**Açıqlama:** Send buttons message (interactive)

**Ətraflı:** Send Buttons

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "header": {
      "type": "string",
      "example": "How are you?"
    },
    "headerImage": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    },
    "body": {
      "type": "string",
      "example": "Tell us how are you please 🙏"
    },
    "footer": {
      "type": "string",
      "example": "If you have any questions, please send it in the chat"
    },
    "buttons": {
      "example": [
        {
          "type": "reply",
          "text": "I am good!"
        },
        {
          "type": "call",
          "text": "Call us",
          "phoneNumber": "+1234567890"
        },
        {
          "type": "copy",
          "text": "Copy code",
          "copyCode": "4321"
        },
        {
          "type": "url",
          "text": "How did you do that?",
          "url": "https://waha.devlike.pro"
        }
      ],
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "example": "Button Text"
          },
          "id": {
            "type": "string",
            "example": "321321"
          },
          "url": {
            "type": "string",
            "example": "https://example.com"
          },
          "phoneNumber": {
            "type": "string",
            "example": "+1234567890"
          },
          "copyCode": {
            "type": "string",
            "example": "4321"
          },
          "type": {
            "type": "string",
            "default": "reply",
            "enum": [
              "reply",
              "url",
              "call",
              "copy"
            ]
          }
        },
        "required": [
          "text",
          "type"
        ]
      }
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "header",
    "body",
    "footer",
    "buttons",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendButtons",
  "description": "Send buttons message (interactive)",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "header": {
            "type": "string",
            "example": "How are you?"
          },
          "headerImage": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIAgACAAMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABgcEBQEDCAL/2gAIAQEAAAAA9/AAABxix7SajXYWN1uzJzdjud1v8vkAAAAAADjRRGL6kAAbaUzDdcgAAAAAOmDQnVAAADazec9oAAAAA6K9gvQAAAA753YXcAAAAD5hNb4oAAAAMuyppyAAAAa2p4+AAAAAJBbmcAAABD6s6AAAAAAd9qy4AAAKzgIAAAAAAn9lgAAOKjiQAAAAAAJdbfIAAcU7GAAAAAAAEnuLkAAVDEwAAAAAABLbdAAKxgYAAAAAc9HR9ZXICfWYABDKoAAAAAOqLRvR4x9bSQSrbgtuXgBrKO6QAAAAPmFQfoAG/sLajuvPYgCk9CAAAABr6u1QAH1PpsN9dgBBquAAAAA1NUYwAAmNii05uB10HigAAAAwagxgPn7+XIE6nhlX13ArevQAAAAcVJpQTi2ZvteuMV1UWvBbG+LDscOig+gAAAAEQrgMr0TZde1zosiW2rm+dK6DZXHy7787xAK0AAAABxTGCO71PtPNUTD7u+6/OFYhZ0oLNnpxRWrAACPxDKnOYAR6qgvyy/JuqAXPeHkbQiQWsbS9eUfpUAANFUxsrj5AV3DRuPYfmiu74sryJ0A9WaDzkPq8fsuvfqygQAAV1DhcO1AVHpRclvePfr2z9+c6tBZnovxb1C3N0T6zOKL1QAAQqvj6uvJA5pLFHpLo86ceytn5QiQNn7N8kxUWdKDa3phUGAAD4q2Pc2VKwHNH9A9RRehVuegvKsLB2e3PLMFFkS4X5H6jAAA1FQba4ADmk8Qekurzkempr5nhFpa6vm49keSYqLMlQt3SV6AABqaf21wACo9KLjuLx0d3o+yYVM/ugqdtL0H4u6xbO9FiaeJgAAamn9rcIAruGja+xfN1bCyroluo8xxT1nEvPAXh3CWa3SgAAamn9tcAAjlWDj19WNIBx39XF4XH5F0w3ltBu8LBAAa7H4NZW2bZ4+8/IHFLYZsfZvlWNbGPh23pcfmavAsmWhnY/SAHEKhOKAA3tgbkhtdlnekYvJ+YLXWk75bZ315xggZ1zfQd3X8gDiro2AAHNnyZxUGpehpLBYItScbfHi9cVPigtKSA+nyAIPAQAAO25cxrqh6AOHH0AmViAfX31AHFJY4AACdTw0dVdQAAlFm8gd2RggGqp4AAA3tsjU1dgAAJvPwDOzNKAaGpwY/fyDr47Q2dxh1QKG/IA21h70AbvYxMA0FUD4ieJ2y7vGnjrf7sbK5AMSIxrTjjLkMrkAAJZt68A+NbF4MNVGje70QnrczkZlq9uwAfGB0fWdlcAALD3NRgx6dwwYEUJFuBD8V3TQCaWEAAAAW5IKDBHqqAaTW5u/5GLoG9zANjcoAAABfmbReqCN1aAAAAZ90cAAAAbW9OazgIRyrAAAADPujgAAACe2a0VJBo6lAAAANpcQAAAC6pA4orVjiuND0YwMHVANrnA2HbPZIAAABtL2ECrIHMeqkGk0ADfbwNjc3AAAABZc/HVQPQCP1SDFh4CXZgbG5QAAADvvvICuK8BoanAjepBtZKDZ3GAAAAWDZIOqhMUMGlwOI9pxuJDyCRWoAAAAyr67gITVYKf1IDpwGd3gLGmAAAAC0ZyAUpoA0FUAAAbK4fsAAADfXYAMCiukIlXHyAANja2eAAAB3XjswAh9Sg10M0eNxxyDjnnYSSY9gAAAC15mABWcBAcgA4AAAAE8s4AAqGJgAAAAAACV2+AAOKdjAAAAAAACT3FyAAHFRxIAAAAAAEst3kAABWcBAAAAAAE8s3kAAAQ6rOkAAAAAHdaMzAAAA19Sx8AAAAASC19mAAAAcQytcMAAAAGZY825AAAAB8V5A8cAAABkTuwO8AAAAAdUIg2qAAAG1m047wAAAAAHGiiMX1IAA20nl2+5AAAAAAA4xY/ptPrMPo6nb35mz2+5kOWAAAD//EABsBAQACAwEBAAAAAAAAAAAAAAAEBQIDBgEH/9oACAECEAAAAAA11NXBi6m2VOtLbYAACJzdLgAM7vo5YADDmeexAAZdD02YAROMggAAndnLAIHE6AAAG/tp4EThNIAAePTd3csMODhAAGuBFwbZc7Kb3mY5XnQACLV4g2223o+pInAYgANFP4trjCigtl1s7+W5CiAAKXT73EShz6Wv5dPsb7rtXzvADGqztBopnUR8ue8drztZne5/RKrjQEenX2RCrHf8D9b+YwUvqeLXmzsayhAKjdYiBXO+4Hs6+lxw7bhV1uvoNeAVm6aIlU7rjdHX9LT8/J5lfZT42kHmKt3S/cvcKPzrqWv1+zuz4DDfct2rwK6D4DKymVsH6Dh740cfoW0p68ESqAPbrZT6fHrwnWR7t0ishPfD14s5uNbDDKwnDdJgGNXFys9EFZe1ixnetUXX7ulZBPn0LCj8e2OiInoBtuwAL6z45rowAMr4ADsrX53hjS4eMto0+Pd9wADP6Jt5CiKuGzsxW61lOAAvuuROAxVkImSkaEWkwAGXfyzledRqgZsD272AA6PqRhwcJDgYA2WUgAE3vMwicJpAAAG7u5YEDiNIAADd288AicXCAABO7OWAGHM89iAAy6HpswAETnKTAAZ3fRywAAa6mrgxdbZKnWlrtAH/xAAbAQEAAgMBAQAAAAAAAAAAAAAABAUCAwYBB//aAAgBAxAAAAAAMIEGJowZ75c6fmAACPTVmIAys7mQAAxpKfwAB7cXeQAaOaigAAldLvAIvMagAAG3p5QEfltQAAePTZ1UgMeVigAGEXRizkSvZXVZCipgADRB8BnYZ3N6R+S8AAaq/wAWFhjVxWdjn1shz1UAAVuv3p49VndRKJKmWvQ4cdiB5AynDVXLzV7UeOmpoWVpl2NfzgDTXrTIjQnWcp9B4eKkXvNLPPo4NUAV+yYIsN1nJ9JErPMem5ZZbLWLEAIWySI8F1POauhuq6p3Ui0yl6NYPPEPOS99xrPOhrImHsnpeSx22Lbr8CHG8B7Mkw4vXYjVzupP3vXgjwQBZ5V+o98EqYe7NQhRnvgE2T5Cjh7LlDbuiHkDTlN1RU32ClyvWGjBs35BLl1LGs8ezNUdLRDOzAAtpvOMKwADK0AA6Sfx2ONdge7Br8e7bAAGXY589VEGOzmiFgmyQALXoUfkvEKMSd7RGJ0gAHvWyCipmmvGTE9sswAXN6MeUjI8Tzwe5TNwAJXVZBH5bUAAANvUyAIvL6wAAG3p5QBH5uKAACV0kgAMaSoxAAZW93kAA0U1XiAMrO5kAAAwgQYujW2b5U6fmAP/xABREAACAQIDAgcJCgwFAwUBAAABAgMEBQAGESExEhMgQVFhcQciMDJAQnKBkRAUFVBSU6GxwdEjMzVDVWJzgpKTorIWJDRU0mN0g0RFZMLhw//aAAgBAQABPwDyiqu1vpNlRVwx6czOAT6sVWdLPESImlm9BNB/Vpioz65BWmt4A6Xf7AMS5zvbghHiiB+Qn/InEuY73N49xk/dAT+0DD3O5P49fUntlbDTzMdWmc9rHBZjvJOAzDcSMLPMh1WZwepiMLc7kniXCpHZK2Isx3uHxLhJ+8A/9wOIs53pAA7xSgfLT/iRilz/ACJsqLeDrvZH+wjFJnSyysOOMsPpp/x1xTXW31ZHvesikPyVcE+zGvxYSBvOK3M1ooeEr1YkceZF35+jYMVuep31WgpFQfLlOp9gxV3y7VuvH10nBPmqeAvsXTyGkvt2oiOIrpQBuVjwx7G1xRZ7nTRa6kVxzvFsPsOKDNForVVI6sRSsfFl7w4BB3H4nq66koo+HUTpFGOdiBri454iTWO2wcYfnJNi+obziuvdzuOoqqtyh8xe9T2Dyehvd0tpHvWrcIPMbvk9h3YtueomKpcoDG3zke1fZvGKOto6xONpp0kj5ypB9XxHW1tLQxGaqnWNF5yfoGLpnd24UVri4I+ekG31LioqqirkMtTM8rnnc6+V09VUUkgmppnicc6nTFrzu6hYbrFwh89GNvay4oq2krIRUUsySod2h5+vy9mVQWYgADUk4vOc4KctBbAJpdxkP4tezpxV11XXymarnaV+s7B2Dm8vo66roJRNSTtG/VuPaOfFlzvFPwYLmBFLzS+Y3b8nCsGAZSCDtBHll1vNFaouMqZdCR3ka7XbsGLxmOuuxZC3FU3NEh3+kef4js+Y6+0MqK3G0+u2Jzu9E82LTeaC7RcZTy7VGrxnYwPWPKr/AJrhoOHS0RWWq3E70j7ek4qKmermeeplaSVjtZviWnqZ6SZJ6aVo5F3MuMv5shuHFUldwY6ncp3I5+/q8nZlRWZiAoGpJxmLNjTF6K1uVj3PMN7dS9XX8U5cza0BSiurloT3qzHevU334RldVZWBUjUEeSSyx08TyzOFRQWZidAAMZizLLc2alpGZKMHsMnWerq+K8uZnltTrS1TF6Jj2mP7x1YhminjSWF1ZHAKlTqCPIp5o4InllcJGgJLHYABjMOYpbtK0EJKUanYu4uRzt8W5dzFNaJVhmYtRsdq86E86/aMQzRzxJNE4aNgGVgdQQfIHdY0Z3YKqjUk7ABjMuYnukrUtMxFGjfzCOc9XR8X5ZzG9pmFNUuTRufXGTzjqwjq6q6MCrDUEbQR4fNmYjUM9son/BKdJnHnkeaOofEmh36Yeppo/wAZUwp6UijBudtG+4U381cLX0D+LXU57JVwrK+1HVvRIPgco5kaldLXWPrCx0hZvNJ80+GzZfxQxGhpH/zUi98w3xoftPxFPPBSxmapmSKMec50GKzOFBCStHDJUN8o94n07cVOa7xPqI5Ep16Il2+1tcTVlXUkmoq5pPScnHBHQMaDoxoOgYVmQ6oxU9KkjFPfLvS6cVXykfJc8Mf1Ypc5zqQtdRpIOdojwG9h1GKG+2u4EJBUhJT+bl7xvVzHl5QzF78iFBWSf5mJe9Y75EH2jwl6usVpopKh9C/ixp8pzuGKiolqp5aidy0kjFmJ+IHdIkaSV1RFGrMx0AGLnm9E4UNqQO27j5B3v7q8+KmqqayUzVU7yydLnXTs6PB23Mlxt3BjZ/fEA/NynaPRbeMW280N1X/LSFZQNWhfY4+8cmnqJaWeKogcrJGwZSMWS7R3ahjnj0V/FkXnVxvHgmZUVnYgADUk4zDd2u1czqT73i1SEdXO3r+ILlc6S1QcfVPtOyONfHc9WLpeay7SaztwYQdUhXxF+8+GVmRldGKup1VlOhB6jiyZpEpSkurBXOxKjcG6n6D18nL14a0VyuzH3vLoko6uZvVhWV1VlIKsNQR4HOl4MEK2yB9JJhrLpzR9H73xBd7vT2in4yTR53B4qLXax6T0KMVdZU19Q9VVSF5G9gHQBzDyHL2YzTGOguD60+6OVt8fUf1fq5OSbzx8JtdQ54yFdYj0p/8AngLhXQ0FLPUSHSOJSSenqGK2slr6uernPfyNr2DmA7PL7jcILZSSVc+0DYic7udyjFZWT19TJV1LayOfUo5lHUPAFlG9hgBm2qrEdQJwWA3nTtwCDu8Ble+HVLVWP1U7n+w/ZyKGsloKuCrhPfxsD2jnB7cUVbFX0dPUQHWOROF/+Hs5ed7pwnitcTbF0km06fNXy8kKCzEBQCSTuAGL7dmu1aXQkU0Wqwr1c7drcokDacZf7n2Yr+qVAgFFRNunqQV4Q6UTe2LX3KMt0QVrg89xl5+G3FRepUxSWGxUAAorNRQ6c6wrr7SMBUGwIgHUoGJIKeZSk1NC6neHjVh9IxX5FylcuEZ7HBG58+n1hb+jF57kDAPNl+58PnFPV7D2CRftGLnarlZqk0l1opaabmEg2MBzqRsYdnK3bQdCNoIxl+7fCtH+Fb/NQ6LL+t0P6+Rka68B5rXK2xtZIu3nA5VfWR0dJPUybI4kLH1c2Kmolq6iapmOskjlj6/L823I09KlvibSWoGsmnNEP+XKoqKruVXBQ0FO89TM3BjjQbT9wHOcZS7nFusaxV12WOtue8AjhQQHoQHxm/WOGYBWd2AVRqzMdAAOck4vPdNyzai8NNK9xqF82l/Fg9ch2ezFd3Xb/OWFvoKOkTmLhp39pIGH7pOdHJIvATqWCID6VxB3UM5QkF62nmHRLTp/9dMW3uxHVUvNlGnPLRv/APR8WXMlkzDHw7TXpM4GrwnvJk7UO3FytlvvFI9DdKSOpp281xuPSp3qesYzn3P6zLfGXCgZ6q067WO2WDqk6V6G5VpuLWuvhqhqY/FlX5UZ34VldVdGBVgCpHODuPu0tRLSVENTCdJI3DD1YoauKspKeph8WVA/t5j2cnPFx4EUFtjbbIeNk9Ebh6z5eSqgsx0UAknoAxcq1rjXVNY2527wdCDYo5NNT1FZUQUlJC0tRM4jijXezNuGMm5QpMqUPmy3OdB76qP/AOadCD6cZhzHbMs0JrblLtbUQwJtlmYcyj6zjMudL1meRkqpeIoddUo4iRGPTPnnt5UUssEsc8ErxTIeEkkbFXU9IIxk/uoca8NszQ6hjokVfuBPMJgP7sEK6srBWRl0IOhVlP1g47oWSBYJjd7VGfgqZ9HjH/ppG5vQbm5WU6/31bjSudZKU8DtjbavIyJcg0c9tmYnizxkY/VO8eo8gnQEk4vNcbjcquqB1Rn0T0F2DyK7Zio7WWgUcfVDfGp0CemcS5uvDsTGYIl6Fj1+lsUmcqxGAraeOZOdo+8f7sUNfSXKAVFJLw13MDsZT0MPBZnrDSWiZVOj1DCEdh2t9HK7lWV1pqU5nrY/8xUBkowfMh3NJ2v9WL7e6PL1rqbrXHWOIAIgOjSyHxUXrOL3erhmC4zXO5ScKZ9ioPEiTmRBzAYJA2nGvL7mud2hkgyzd5tYXIShnc7UbmhY9B83FVS09bTVFFWQiWnnRo5Y23MrYzNYZ8tXmqtUxLRqeHBIfzkLeK32Hk5Yq/el3gUnRKgGFu07V+nkWWuNtudJVa6IrgP6DbDgHUAg+7miuFFZ6llbSSQcUna+/wCjyLMN0a10HChOlRMTHEfk9LerBJJJJJJOpJ3k+7ablLaqyOpQkxnRZU5mT7xzYDKyq6HVWAZT0g+BznUcOro6QHZFEZD2ufuHJy/aHv16t1pTUColAkYebEvfOfYMRQxQxxU9PGEijRY40G5VUaADHdJzGb3fHoIJNaC3M0KAbnm3O/2D3O5rkqlFHFmO70yyzT99RwyrqscfzhB3s3Ni/wCXbdmO3y0FbAgYqeImCgPC/Myn6xiqppqKqqaOpTgzwSvFIvQyHQ8rbvBII2gjeDjIuYjmSwQzzvrXUx971XW6jY/74x3VbGK+xR3eJNai2vqx5zBIdG9h0PJR2idJUOjIwYdqnXEUqzxRTr4siK47GGvIyvWrW2anZ2JliHFN2p7ueq0vU0tCp2RoZGHW2weRZ0djXUUfmrTlh2s3JsTtJZrazb+IC/wnTwOYpuOvVeeZHEY/cAHJ7j1tEldeLu6/iIUpo/SlPCb6BjM11Nky/drop0khp2EX7V+8T6Tjbzkk7yTznCpxjpH8tlX2nTEUMdNFDTRKFjijWNAOZUGg9zus2mKhv1LcoRoLjAXkH/VhIUt6wRy+5TdTRZlNvZ9IbjA0enNxsffocVVLFXUtTQzjWKoieFx+q40xPBJSTz0kv4yCV4n7UPBPJy7Lx1loGO9UMf8AASORkSuMVVVULbRInGKD0rsPuHF7qvft1rp9dQZSq+inejyLOdEzwUteg1ERMUnUrbQeQiPK6RRqWd2Cqo3knFFTCio6WkB14mJUJ6xv8Au8Yr34yurZD51RKf6jye5PTCHKjT6bamumf1IAgx3Xaow5boqUHbU16a9axqW9w6713jaO0YsdzivVntt0iYEVFOjN1OBo69oIw7pEkksjcGNFZ3boVRqTjOWaWzXdhWJGYqOBDFSxt43A11Lt1ty7JVtQXq0VqHQw1sD+rhgHDbGOnMcZ5pxS5vzBEBoDVGX+aof7eTlB+FaCvyKiQe0A8ix1ZortQ1GugEoVj1P3pwMXapNJbq2pB0McLle3TZ5HJHHNHJDMgeN1Ksp3EHF8sEtpbjomMlG7aK3nITuVvsPuAFiFUEsSAANpJOMv5d+DytbW6Gr07xN4i1+tvAr4w7cVWyqqv20n9x5Pcy0/wVa/2tTr/NOO7Jr7wy/0e+p/7B7vcrzOtBWPl2tl0pqx+HSs25KjnTsf68EAhldQQQQyncQd4OM8ZTlyvdCIVZrZVMXpZPk85ibrX6Ry4tTNABv41P7hht5x3SwBnW76c605PbxS8nJn5Oqhze+T/aOTaak1luoqknUvChbt024zrUmK0cSN80qJ6h332eSX9Fey3IMN0Jb1ggj3LEA15tgYajjwfYPBDeMXBOLuFenRUS/3cnuTVImyq8HPT10yEdTgOMd1ukM+WaaqUf6WujZupZFKe6CQQQSCCCCDoQRzjGQM5pmOjFvr5ALvTJ3+v/qIx+cXr+UMXS10N5oZ7bcoBNTSjau4gjcynmYcxxmzIt0yw71Chqu1k95VIu1B0TAeKevcfcyp3M579bkutxrno4JxrTIiB5HX5ba7lPNjMPc3v9kLTUsZuVGNvG06HjE9OPafWPdy9SGvv9lowNeNrYQewMCfoGG2ses4zzUirzfmCYHUCqMQ/wDEoT7OTk5NLVK/y6l/oAHJyVUma0CHX8TK6eo999uM+1HCkt8HQruR26AeSX38jXP9gfcsX5Ztn7ceDzFFxN6rxzO4kH74B5PceuQir7vaHb/UQpUR+lFsb6DjMNrF7sd1tXn1FOwj6pF75D7RghlJV1KupKsp3gjYR7tNU1FHUQ1dJO8NRC4eORDoysOcYyb3Q6O/rDbrqyUt28Uc0VR1p0N0rgjYysNQQQQRqCOgjFT3O8n1VWKx7SEbhcJo4pGSFz1oMKqIqoiqqKoVVUaBQNgAGASNxx3XLNRUlTbLxTRrFPWNLHUKuwOyAEP28x9zuTWk1mYJ7o6/gbfAdD/1pu9X6NcVtZFbqKruE50ipoXmbsQa4mmkqZpqmU6yTSNK/pOeEeTlqIw2Si13vw5P4m5OQKni5bhAedUcD2g4zpJw728fzUSJ9bfb5JfvyLc/2J+se5YvyzbP26+DznT8CspKoDZLEUPpIfuPJsd3msN3t93hBJppQzL8qM7HX1g4hmiqIYamnfhQyoskbDnVxqDjunZeFovnwlTrpSXPhS6DzJx449e/k5b7pt5syx0lyU3KiXYOG2k6D9V+fsbFnzvli9qopbnHDOd8FT+BkHt2H1HCjhgMmjDpU6jF3vlpsNO1Rda6OAAahCdZX6kQbScZwzVPmu5rVGMw0kCmOlhJ1KqdpZv1mwqs7KiKWdiFVVGpZjsAHWcZMy9/hqw01DKB77kPH1RHzr+b2KNmO6xfVorPBY4X/D3Bg0oG9aeM6/1NyQrMQqjVmIA7TinhFNT09MN0USJ/CNOTkuTgXtE1042J0+pvsxmKXjr3cX6JeD/AAvkl9/I1z/YH3LCNb1bf2w+o+DzTR++rTJIo1enYTDs3NyTuOMpRSwZWy9FP+MWgh1B6xqMd2OuQ/ANrHjjjap+oHvF5RAO8YiqamDZBVTRehIy/UcOzSOZJGZ3O9nJZj6zjdtOO5nkp0eHM93h4PPQQONv7Zh/ZivrqW2UVVca6Xi6anjMkjdQ5h1ncMZgvdTmK71l2qQVMraRx80cS7ETk5cpPfl3pQRqkJMz9ibvp5WXJRDe7e555Cv8AGCuLm3DuVwfpqZT/AFHwxIUFmICjeSdBiW8WmE6S3KAHoD8L6sHMNkH/ALjH7G+7H+I7H+kU/hf7sf4jsf6RT+F/ux/iKx/pFP4W+7F6v1rltlXT01UJpZk4CqoPOd59y21S0Vwo6twSkUgZgN+m44GYrIQCLinrVgfqx/iOx/pFP4W+7H+I7H+kU/hf7sf4isf6RT+Fvuwt/srbrlCO3UYgq6Sp/wBNVQy+g4J5LKrqyONUYFWHSDsOLhRvb62oo3/Nvop6VO1TyLPb2u12ttsTfVVMcR9Envj6hgKq6JGNEUBVHQBsGO6HcRcM3XZw+sdMy0idkI0P9WuKC1XS6OEtluqao/8ARjZh6zuGLjlPMtpgNTcLLUxQDa0mgdV9IoTpjeNRyaenqKueOlpIJJp5DokUSlnY9QGMndzBaR4rnmdEknUh4qEEMiEc8p849WJZY4o5J5pFjijUu7uQqqq7yTzAYz7nZsy1IobezLaKd9U5jUSD84w6B5o5WUKDiKGStcd/Ut3v7NPvPKtjcC5W9+ipiP8AUMVDFp52PPIx9p8ISqhmZgFUakk6ADF0zckZaC1KHYbDO47390c/acVVbWVzcOrqZJT0Mdg7BuHhtx1Gw4ocx3WhKrx5niH5ubvvYd4xar7RXYcCMmKoA1MLnb2qeccjN9t46CO5RL38A4EunPGdx/dPI7k9u995mkrmXVKCldx+0l7xcA6EEYo8mZXoppKlLPDLUO7SNNU6zuXY6k9/qBhQFUIgCqNgVRoPYMbRqMXnudZXvJeUUhoaltplpNEBPWninFb3HbpGSbdeaWdeZZ0aJvo4Qw/crzgp0EFI/WtSv24g7k2apSOOeggHS0xb6FGLb3HqKMh7xeJZ+mKmQRL62bU4tFhs1hiMVot8VOCNGcDWR/Sc6k4vF7tVgpTWXasSCPzFO2SQ9CKNrHGcM93DNDNSwq1JalbVacHv5dNzSkfQu4cq2UElyrYKNNgY6u3yUG84REijSKNQqIoVV6ANg5VO3AqIGHNIp9hwx1Zj0knwbMqqzuwVVBLMdgAHOcX+/wAl0kanpmKUKHYNxlI85uroHkSsyOroxV1Oqsp0II5xjL1+FzT3rVECsjXXXcJVHOOsc/usiOjpIoZGBVlO4g7xi82t7TWvBtML6vC5506O0e73KKSCgy3XXWeWOP33VsC7sFASEcEAk4uPdByjbeEr3dKiQeZSqZj7V2YuPdiTvks9kJ6JKuTT+hMXDuiZvuJIN1NLH8ikQRD27Wxau6Hmu1yhjcmrIfOhrPwgPY3jDFq7rVgqwqXWlqKCXnYDjovau3FJmfLdeAaS+0MmvMZlVvY2hwtRTNpwamE67tJFxPc7ZSgmpuVJEBzvOi/WcXDuh5Qt4bW7LUyDzKRTKT6xsxee69XTq8Nht60gO6eoIkl9SDvRitray41L1lwqpamobfJKxZuwdA6hy8tWk26kM86aVVQAWB3onMv2nlodHU9BBww0Zh0Ejweb7oUVLVC2hcB5yPk8yfafJIJpaaaKogfgyxsGVhzEYt9bHcaKCsjGgkXvl+Sw2Ee7dbZDdaRqaXvXHfRSc6P9x58VNNPRzy01ShSWM6MPtHUfcOpXgEkrrrwSdmvZyiqneAccFejHAXfwR4HK9jNQ6XOsT8Ah1hQ+ew870R4BRqyjpIGJ14M8y9EjD2HwTOsas7nRFBZj1DacVlS9bVVFXJ40shfsB3DyXJdWeFW0DHYQJk7R3rci92SK7wgqQlXGPwch3EfJbqxPBNSzSU9RGY5UOjKfIbBl97iyVdYpWjB2DcZSOYfq9JwAqqFVQFAAAA0AA5h4CnUtPCo3mRR9OLmvAuVwToqZR/UfBXyUw2e5ON/Elf4u98myzKYr3RdD8OM/vKeTdrPS3eILN3kyD8HMo2r1HpXFwttZa5uJq49NfEcbUcdR8N0DeTiyZWZylXdUKpvSnO9ut+gdWAAAFUAADQAbAAPA2xeHcrenTUxD+oYzFFxN7uKf9XhfxgN4LM50sdZ1mMf1jlbgSToMGrpQdDUx6+kMKysOErBh0g68t5YotksqJ2kDCTwynSOZGPQCCeVZSReLYR/uE5U8EFVE8FTEskTb1YajFzyhNGWmtbmVN/Eue/HonnxIjxO0UqMki71YEEeDt1luNzINPDwYeeaTvU9XTi1ZforXpL+OqfnXG70BzeDy5Fx17t6H5wt/CC2M6R8C9vJppxsSP9a/Z4LNH5Dq/Si/vHJkkSJHlc6Ko1OKqslq3Jc6J5qDcPcgnlpnDxMQeccx7cU1QtTCsyjTmI6DyblXtCTTwHR/Pbo6h14JJJJJJPOcdeLbcHdhTTtqT4jnf2Hk2b8r2z/uUweXWUFHXpwKymSUDcSNGHYRtGKzJiHVrfVleiOYaj1MMVNgu9JrxlC7qPOi78fRhgUPBcFT0MNDyNR04goa2q2U1HNJ1qh09uKTKFzn0NU8dMnWeG/sGKHLNqoirtEaiUedNtHqXdjoHMPCZLj4d8jk+aid/qX7cZ+pikluqNPGR0P0EeAllihQyTypGg852Cj6cNfbMnjXOD1En6sZkv1DWUXvGikMpeRWdwpCgLt027zybwxFKqjc0g19Q15Flc61EfNorcgYmcyTSu29nY+6rFGVxvUgj1Y11APSAeRb50pq+iqJPEjmRm06AcfDtlO0XOD1kjEV3tU7cCK407NzDhgfX4GSOKYaTRJIP11DfXh7NaJNr22n9SAfVg5esh/9uj9rYWwWVDqLbD69T9ZxFRUUH4mjgT0Y1GNT0+HyFT8KS4VHQEQH2k4zrTma0GYfmZkf1Hvft5dXUx0VLUVcviRIXI5zpuHrxX19Vcp2qKuQsfNXzUHQo5dzhM1I/BGrIQ49W/kWaErFLOR45AXsXk1sJgqZUI2Ell6wfdpoWqJ44V5zt6gN/L0BxlS7zLULa55C8MgPE8I6lGG3QdR8syVTGG0CY/n5Xf1DvfsxdqY1luraYDUvC4Xt02cvNLFbJVdbxD+rwNXaeExkpSBrvQ7B6jj4OrddPe7e0Yp7PIWDVTBV+Sp1JwFVQqqAFA0AHMOTVUkVWnBfYw8VhvGJLVWISFUSL0qfsOI7XWOdDGEHSxxSUUVIpC987eM58BZyVu1tI/3Mf14O8+V2qmNJbqOm00McKBu3Tbg4vlJ7yu1dT6aASllHU/fDlZs/Ik37aL6/LLV+VLd/3Mf14O8+VWOk9+3ahg01BlDN6Kd8fdz3QmKqpa5dqyJxbEdK7Rys1jWyT9UsX1+WWn8qW7/uY/rwd58qyLRF6mrrm3RoIl7W2n3c1UC1lmnRRrNGOOUda8rMkTS2SuCjUoEk9SsCfLLHE0t4tyKN06sexdp8ryxRe8rPTKy6SSDjX7X+4e6RqCCMXqgNtudXSaaKrkp6DbRySFZWVlDKQQQdxBxdMp1cEjyW1ePgJ1EeoEidW3eMG03Vd9tqf5ZxPR1lKFappZYg24uhUHl11aKNU0ThO+ugJ0AAx8NVHNDF9OPhmp+ai+nHwzU/NRfTj4Zqfmovpx8M1PzUX04+Gan5qL6cfDNT81F9OPhqo+ai+nFDWisV9U4DoRqAdQQeX8E3Tgh/g6p4J3HiziKx3icgJbph1uOAPa2LBYBag1RUOr1brwe98WNegdJPOfKrLQm43OkpdNUL8J/QXacAaAAbuRnq2hooLnEv4s8VJ2HcfUeXqenGadDY6rXbo8RHbwuXek1Snk6GZfb4GypsqX5iVXlWdVa7W1XAKmoTUHBJ1O3yzI1u4EU9ykXbIeLj9Ebz6zya+jjq6Oemm8WVCpxU08lJUTU0w0eJyp9XLzT+RKr04v7uXXQGopZY18bxl7R4GggNPSxoRox75u08q0fla2/9zH9eD5XTU8lXUQ00I1eVwo9eKKlSjpYKWIaJEgUerlZ4tJjkiukSbG0jm7fNPLzOpax1unMYz7HHgLpRmFzURj8E5779VvuPLtlGZpBPIPwSHZ+s33Dl2QcK8Wwf/ITyzJFr4Ty3WVdi6xw9vO3LrqGKupKimn2xuhU9vSOzFbSS0NVPSTjR4mKnrHMew8q505qrdXU4G14HA7QNRgbhyyFYFWAII0IOKu1OhMlKC6fI84dnTjn0O/3d50G/FHankIkqgUTmTzj92FVVVUUAKBoANw5eVYDNeoH072FHkPs0H1+V0VHLX1UFJANXlYKOoc5PUMUFFFRUsFNENIolAHX4DO9l46FbnTJ38Q0l606f3eUNhxfKA2651MAGkbHjYvQf7t3gZqaCf8dErHp3H2jDWekPitIvUCD9eFs9KPGaRvWBiGmp4PxMKqenefb4HJ1CYaSeuddGqG4Kegn3nyvJdnMEDXOdNJJhpFrzR9P73gXVXUoyghhoQcZisz2e4PGFPveQloj1c6+rlZitBulIGhXWqg1aP9Yc6Y0IJBBBGwg7wfI7VbZbrWJTR6hB30r/ACE+882I444Y44YlCxooVVHMB5Vl60Nd69UdT73i0eU9XMvrwqqihVAAA0AHgr7Z4rtQyQPscDVH+S/MRioglpZ5aedCskbFWU8q/wCXBXF62gULVb3j3CXrHQ2HR43aORGR1OjKw0IPkNttdXdZuKpk70ePK3iJ29fVi222mtVMKamBPPI58Z26T5VT08tVPFTwIWkkYKoxZbVFaaKOnTQt40j/ACnPhM35dFZEbhRprUxDR1G91H2jl3C00F0XSrhBcDRZV2SL68VeTatCWoalJl5lk7x/uxLYrzCSHt0x60AcfRg224jfb6n+U2Pg64c9BU/ymx7wr/8AYVP8psfB9w/2FT/KbHwdcf0fU/ymx8HXH9H1P8psfB1x/R9T/KbHwdcf9hU/ymx8H3D/AGFT/KbHvCv/ANhU/wApsfB1x/2FT/KbC2y5MdFt9ST+ybEGWr1Of9HxQ6ZWC4ocmwRkPcagyn5uLVV9Z3nEUUUEaQwRrHGu5UGgHleU8v8AvKIV9WmlTIO9U740P2nw2bsttSO9zo0/AudZkHmE+cOrp8Dqek41PScanpONT0nGp6TjU9Jxqek41PScanpONT0nGp6TjU9J8tynl01DJdK1PwSnWFD55HnHq8O6LIrI6gqw0IO0EHGZsuSWmZqmnQmjc+uMnmPV8X5ay690lWqqVIo0P8wjmHV0nCIsaKiAKqjQAbAB5BPDFPE8MqB0cEMDuIOMxZdms8zSwgvRs3etzoeg/Yfi3L2XpbvKJpgUo0bvm3FyPNXEMMcESQxIEjUAKqjQADyKaGKeJ4pkDIwIYNtBBxmTLE1pkapplL0bHtMfUeroPxXl3LUt0daqqVkowewyHoHV0nEMMVPGkUKBEQAKoGgAHkjosisjqGVhoQdxGMyZQekZ6y2IXhO14RtK9a9I+Kcu5SepKVlzQrDvSE7C3W3QMIixqqIoVQNABuAHk9/ylFXiWst4EdTvZdySH7D14np56WV4KiJo5FOhVhofiWCnnqpUgp4mkkbcqjU4sGVIaDi6qvAlqt6rvSM/afKrtZaG7RmKePaviyDYynqOLxlyvtDM7LxtNzSoP7hzfEdny5X3ZlcLxVNzyuN/ojnxa7PRWmIR00XfHx5G2u3afLGUMCrAEHYQcXrJMFRw6m2kQSb+LPiH7sVtBWW6UwVkDRvzajYew8/l9FQVdwlENHA0jc+m4dp5sWfJlPTFJ7kVnlHmfm1+/AUKAqjQDmHl9dRUlXCaeogSRDvDYumR2HCmtUuo+ZkP1NippKmjkMNVA8TjmYfV0+V01JU1kohpYHlc8yjX29GLXkgngy3SXr4mM/W2KSjpqKEQ0sCRoNyqPiOqoqariMVXAkinzWAIGLnkSIhpbbPxR5o5TqvqO8Yr7Lc7aT76pHCDz175PaPJ6Gy3O4kGlpXKHz271PacW3I8KcGS5z8afm4yQvrO84pqOmo4hFTQJEg81QB8TkA7xiuyxZ64M70yxSE+ND3pxXZEqY++oapXU7Qkvet7RirsV2oiffFDKAN7KOGPauvkNLY7tW6cRQykHzmHAX2tpiiyLUPo1dVqg51i74+04ocsWeiCstKJHHny9+cAAbh8W1Vrt1YxM9HE/WyAn24q8l2WVjxAlh9B/wDlripyA6amC4AjmDp9oOJMlXpdTGIZfQc/aBiXLl7h8e3yH0SH/tJw1qua+Nbqkf8AibDUdWnj0sw7UIwyOvjIw7RhUdvFRj2DC0dW/iUsx7EJwtqubeLbqk/+JsRZcvc3iW+QekQn9xGI8lXptOMEMXpufsBxT5BZhwqi4gAbwifaTilyXZ4TrKss3pvp/bpiltNvpNtPSQx6c6oAT6/Kf//EADsRAAIBAgMEBwcEAQMFAQAAAAECAwAEESExBRASURMgMDJBUnEGIkBhcoGRFCMzobFCguEkU1RjosH/2gAIAQIBAT8A7KSaKEcUsiqPmcKn25aR4iMNIflkKl2/cNlFEieuZp9qX0mtww+nKmuLh+/M59WNYk6mgSNDS3FwndmcejGo9qX8elwx+rOotv3C5SxI4+WRqDblpJgJOKM/PMVHNFMOKKRWHyPwdzfW1oMZpBj4KMyautuzyYrbr0a89WqSWSVi0jsx5k49nHLJEwaN2U8watduzx4LcL0i89Gq2vra7GMUgx8VORHbvIkSl5GCqNSavtuM2MdpkPOdftTOzsWdizHUnt1dkYMjFWGhFWO3GXCO7zHnGv3pJElUPGwZToR2l3eQ2cfHKc/BfE1e3896+LnBPBBoPg7K/nsnxQ4odUOhq0vIbyMPE2fip1HZX1/FZR8TZue6tXFxLcyGWVsSfhbe4ltpBLE2BH4NWN9Hex8S5OO8vYXl3HZwmV9dFXmauLiS5laWVsWP9D4LiQasKDKdGHUt7iS2lWWI4MD+as7uO8hEqa6MvI9aSRIkaRzgqjEmr+8e9nZzkgyQch8BJKkQxdqkvXOUYwFNJI3ecnek0qaOajvdBIv3FKyuAykEbrC8eznVx3Dk68xUciSosiHFWGIPV25fcTfo4zkub/M8vgLi5EXurm/+KZmclmOJ68UrxHFT6iopVlXFdfEbth33C36SQ5Nmnry6l9ci0tpJTrhgo5k07M7M7HFiSSe3uJuiTLvHSiSSSTnvtNi392AyxcCH/U+VJ7Kvh794oPyWpPZWcDGK6RjyZSKu9m3lkf34SF8wzX8jfFI0Thh96Rw6hl0NKzIyupwYEEGrG5F3bRzDUjBhyI37dueknW3U+7GM/qPwE8nSyM3gMhuALEKoxJOAFbM2PBYwi8v+HpAOLBu6n/NXvtM2JjsUAXzuP8CpNq7RkOLXkn2OA/qods7ShIK3Tt8n94f3Vh7QQXeFtfRqjNljqjevKts7DFuGu7Mftaunl+Y+W+ylwJiPjmN2wrro52t2PuyafUN00ohiklbRVJqSRpZHkY5sxJ7B3CKWOgqS6lc5NwjkKhunVgJDip6ty/BC58Tlv9m7ESzPeSrisWSfVz+1be2m13cNbxN+xEcPqbnVt7O3M9oLgyBHZeJEI1FFSpKsMCDgRv8AZ/aJuEawuDxFV9wnxXlW17L9DeyRKP2299PQ7kbgdW5GhmAajdopEkU5qwIqGQTRRyroyg1tybo7QRg5yNh9h2N0CYWw3oCEQHUAdS+PuIOZ32v/AEPs/wBKuTdCz/dqB94E886jZGijdSOAoCPTCtpSQy31zJb/AMbPlvsZjb3ltMD3ZFx9Dka9qYgYbWfDMMV+xGO+E4xRn5DdsKbpLQxk5xsR9jnW35eK5ji8iY/c9jrkauoljk93QjGrOJWxkbMg5dW+7sfqd8o6X2cHB/46/wDzu9ndpqyDZ87Zj+MnxHlrbOxpLZ3ubZC0DHEgap/xVraXF7J0VtGWbDE+AAq4tbi1cx3ETI3zFQqXmiRdWdR+TXtOwFjAviZR/Q32/wDBH6btgS8NzJETk6Y/cVtR+kv7g8m4fx2V7/Iv01Zdx/Xq3i4xY8jv9np0utny2T5lMVI5o9Xds9pczW76oxHqPA0CVIZSQQcQRWzfaNeFYNoeglAx/Iq1Flg0loIsHzJjwzr2iurUWbW7FWmYjhAzK/OtgWZub5JSP24ffPr4Cvaa6EtzFbKcolxb6m3xrwoi8gN2y5Ojv7c824fzVw3HPM3N2P8AfXLKveYCulj86/mulj86/mrxlaReEg4CrN0VHDMAca6WPzr+a6SPzr+aBB0O51Doy8xTAqSp1G72VhPFd3B7uCp/+1tWR7zaVy0alvf4FCjHu5VJFLEeGWNkPJgRuDMuasR6GrLZ91tCQLEpw/1OdBUslrsCwEceBlI90eLNzPyqSR5ZHldsXYkk/M7rdOklUeAzO+2bgnhflIp/uicST1p7sklIjlzokk4kknrq7IcVYire56Q8D5N4HnuvIsG6VdDru2Obex2ZCZ5kQyYyHiIGtPtzZFpiLdOI/wDrTAfk0m1tkbRXo7lVU8pR/g0dhbHm96JyAfJICKGyth2nvyspw/7klXXtDZ2yGHZ8YcjIEDhQVcXM11K007l3O+1i6NMSPebepwIPzojAkdW8kKIFGrf47IEggioZOkjVvHxplDAqwyNTwNC3NToaJJ34nnWJ6lrbkkSOMvAdRRiQKuF4LideTsP76t6cZFHJd4BOg6gBOlEEajfZHGNhybcyq4KsMRU1oyYtHmv99ZVZzgoJNQ2gUhpczy6tsvHcQrzkUf3W1E6O/uBzbi/PULqurAepq7dXl90g4Dci8TqvM0FCgACrhAU4vEb40CKABnUiB1II9N9k6hHBYDOgwbQg73hjk7yjHnTWK/6XI9aNlJ4OtCxfxcUllGO8xNKiIMEUDrbLTpL63HJuL8Vt+LhuY5fOmH3G+RiqOw8AaJLEknE71PCwYeFLKjDHiFTyqV4FOPPfFMrKATgakmVVOBxPUhcpIhB8e22BFxXMkvgiYfc1t2HpLQSAZxsD9jlvm/ik+k9snfX1HbbDh6O0MhGcjE/YZVNGJopIm0ZSKkjaKR42GasQdzrxKy8wRTwyIcChogjIjDeqliABnX6eTkK/TyV+nkr9PJyFMpUkEZ7wrN3QTUEDu6kqQAcST2saNLIkajNmAFQxiGKOJdFUDdt216OdbhR7sgz+odS9/lH0jfE3C6nqysGkY77HuP69tsK16Sdrhh7sen1HffWwu7aSHx1X1FMrIzIwwIJBG++H7iHmOpDMCArnA8980wAKoc+fUsh+2x5t2qKzsqKMSxAAqxthaW0cQ72GLH5nqbcseFv1cY91sn9ee+6i6SPLvLn1RI66MaMjt3mPUVSzBV1NRJ0aKnIdrsOxLN+rkGS5J68+rJGsqNG4xVhgRV/ZvZTlD3DmjcxvntBISyZNTQypqhrgfyGuB/Ia4H8hrgfyGuB/Ia4H8p/FJbzPohHzNQW6xZ6tz7Wws3vZwg7gzduQqONIkWNBgqjADrXlpHeQmJ9dVbkauLeS2laKVcGHw9vbyXMqxRLixqztI7OFYk11ZuZ7C+sI72LhbJx3Wq4t5baRopVwYf38Lb28tzIsUS4k/wBVYWEdlFwrm57zdld2cN5HwSrn4MNRV5YT2T4OMU8GGh+Ds7Ce8fBBgni50FWlnDZxhIhn4sdT2jxpKhSRQynUGr3YbLjJZ5jyHX7U6MjFXUqw1B7dEd2CIpZjoBVlsNm4ZLvIeQa/eo40iQJGoVRoB29zZW12MJowT5hkauthTx4tbt0i8tGqSKSJisiMp5EYdnHFJKwWNGY8gKtdhTyYNcN0a8tWq2sre0GEMYB8xzJ+DkhimHDLGrj5ipth2kmJjLRn5ZipdgXK/wAUqP65Gn2Xfx627H6c6a2uE70Dj/aaKsNVIoKx0Umltrhu7C5/2mk2XfyaW7D6sqi2BctnLKiD8modh2keBkLSH55Co4YoRwxRqo+Q7P8A/8QANxEAAgEDAQUGBAUEAgMAAAAAAQIDAAQRMQUQEiFRIDAyQWFxIkBSgRMUM5GhI0KCsSTBU2LR/9oACAEDAQE/AO6eRIxl3Cj1qTalunJOJz6chT7WmP6car/NPfXT6zEe3KjNK3ikc/c1knU1kjSlmmXSRx9zSX10mkxPvzqPa0w/URW/io9qW78nyh9eYpJEkGUcMPQ/Jz3MNuP6j8+g1qfasr5EI4B11NO7yEs7Fj1J7tHeMhkYqeoNQbVlTAmHGOuhqC5huBmN+fQ69+zqilnYADzNXW1C2Ut+Q+o0zMxLMSSfM9+rMpDKSCPMVa7UIwlxzH1DX70rq6hkYEHQjvLi4jtk4nPsPM1c3cty2WOF8lGnydtdy2zZU5XzU6Vb3EdynGh9x5jurq6S1TJ5sfCtTTSTuXkbJPysM0kDh42wRVrdJdJkcnHiXuLm4S2jLtr5DqamleeRpHOSfkiyjzFZB0I7EMrwSCRDgira4S5jDrr5joe07qis7HCgZNXdy1zKWPhHJR8g7qgyxprlj4Rii7NqxO9ZHXRjSXPk4+4oEMMg5G60uWtpQw5qeTD0pHV1V1OQRkdnal1ki3Q8hzb5CWYJyHNqJLHJPbR2Q5BpJBIMjdsu6w35dzyPNexczi3heQ66D3pmLMWY5JOe/lk/DX1OlE5OTvt9mXdwAwj4VPm/Kl2C2PiuAD6LT7ClAzHOp9CCKuLK5tv1YyB1HMb0cowYUrBgGFKxVgynBBzVtMJ4Uk89D779qz8cohU8k19z8hK/G5P7bgCSABkmrLZ0VrH+Zu8cYGeei1dbbbJS1QAfU1Pf3jnLXD/Y4qPaV7GeU7H0bmKtNrRXGIbpFUtyz/aa2lssQg3FsPg1ZenqN9s+CUO7ZU/BKYWPJ9PcbpHEaO50UE07l3ZzqxJ7hmCgsdBTzux5HAqOdgQGOR2Zm4Y2/bfsW1EkjXLjKpyX3rat6biUwo39JDj3NQ7HmltxMXCsRlVIoggkEYI37IvDMptJjkgfDnzHStoW35W5dB4D8S+x3KeFg3Q7kco6uuqkGo3EkaONGANbUl4LcINXbH2HczgmNsb1GFX27FyfhUeu+3/4uyOMcm/DLfdqB5gnrSMpRWU/CVBHtV68cl1O8XgLb7WUw3MMgOjituxgxwS+YYr+++M5RD6btlycduUOqHH2NbWfMyJ9K/77qZAj8tDVugOXPkezdaJvkHHsYcP/AIR/G7Y98CotJTzHgJ8x0raWzXgZpoVzEeZA/tqC3muX/DhTiOtSwSwMUlQqfWo14pEUalgK24QLWJfMuP4G+H9JPbdsmTEzx/Uv+qvn47uY9Dj9u6ufGvtVt4G9+zcjKZ6HfsiVZ7R7ZtVyP8Wq4ha3mkhbVTQJUgg4Iqy2yMCK79uP/wC1ALXm9v8Ah/FqUxzrbE8AtmhYhpSRwjzHrWybYz3SyEfBH8R9/Kttzh50hU8oxz9zvQYVR0G6xbgu4T1OP3qY8UsrdXPbLAakVxp9YrjT6xVwQzjBzyq3ZQrAkA5rjT6xXGn1CgQdDuZeJSvWiMEg7tgxnNxL5YC/91fO1xezFFJ+LhAAzpyp43jOJEZT6jG4EjQkVbWk92/DGpx5sdBUjwbJtAic3Og82bqad2kdnc5ZjkndCvE4HkOe+FuGWJujiickntSzkkqn70ST21YqcqcVFPxfC+u64jweMaHXds4w2tjEZZFUvlzk9abamz7fIhXiP/ouKXaGzrxeCcBfSQf90dlbOk+JGIB+l6Fhsu3+KRlOPrep9r28Cfh2iBiNCBhRU00k8hklYsx3wR8C5Op3g4INHU9m4fhXhGp7uJuNFNEAgg6VLEYz6eR7GT2YIc4dhy8h2AMkCphwyyr0Y9m58Y9t4BOg7i28DD13MoYYI5VJAV5pzHaALHAGTUVvjDPr07MK8UsS9XFXycF3MOpz+/YLKNSBU7BnyDnluUcTAUAAMCplBXi8xvRAoFOoYYO+2ZQrAkDnQIOh3tGj6rRtR5NX5Z/qFC2bzYUtsg1JNKqqMKMdqxXju4R0Of2rayYmR/qX/W9zwqx6CiSTk71JBBoSKRrUsgI4V3xyKQATg08igHByexGxV1IPfbJjzM8n0r/JrakfHbhxqjZ+x3yfpv7d8viHuO+2XHwW5c6uc/YVIgkR0OjAinQo7IdVJG5hxKR1FNG6nBU1jG8AscCvwX9K/Bf0r8F/SvwX9KIKnB3gE6Coo2ZhyIHeohd1RdWIFRoI0RBooA3bVg4JRMo5Pr7jsXP6n23ocOp7Mhy7HfbeFvfvtlQccpmI5Jp7nfdQC4heM66j3plKkqRgjlvuR8anqOxHKPC2+SUYKr2LYfAT1PeqpZgqjJJwKtYBbwpGNdT79jalrhvzCDkeTe/XfOhdeWo7Idhoxoux1J7ABYgCkXgQL3uy7XJ/MOOQ5L2XVXVkYZUjBq7tmtpSp8J5qeo3ywBssvI0Y3XVTXCehrhboa4T0NcJ6GuFuhrhboaWKRtF/eooRHz1bvbS2a5lCDwjmx6CkRUVUUYAGB2rm3S5jKNr5HoalieCRo3GCPl4YnnkWNBkmra3S2jCLr5nqe4urVLpMHkw8LVNC8LmORcEfKxQyTuEjGSatbVLVMDm58Td1cW0dynC45+R8xVzaS2zYYZXyYafJ21pLcthRhRqx0q3to7ZOFBz8z5nvGRXUq6gg6g1dbLIy9vzH0mmVkJVgQR5Hv1VnIVQST5CrXZZOHuOQ+kUqKihUUADyHfzW0NwMSJk9fOp9lSpkwnjHTQ06Ohw6lT0I7tEeQ4RSx9BUGypXw0zcA6amoLaG3GI0wep1+TeNJBh0DD1FSbLt35pxIfTmKk2TMP05Fb35U1hdprCT7c6MEy6xOP8TRBGoIoAnQE0sMzaROf8TS2F2+kJHvypNkzHxuq/zUey7dOb5c+vIUkaRjCIFHoO7//Z"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          },
          "body": {
            "type": "string",
            "example": "Tell us how are you please 🙏"
          },
          "footer": {
            "type": "string",
            "example": "If you have any questions, please send it in the chat"
          },
          "buttons": {
            "example": [
              {
                "type": "reply",
                "text": "I am good!"
              },
              {
                "type": "call",
                "text": "Call us",
                "phoneNumber": "+1234567890"
              },
              {
                "type": "copy",
                "text": "Copy code",
                "copyCode": "4321"
              },
              {
                "type": "url",
                "text": "How did you do that?",
                "url": "https://waha.devlike.pro"
              }
            ],
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "text": {
                  "type": "string",
                  "example": "Button Text"
                },
                "id": {
                  "type": "string",
                  "example": "321321"
                },
                "url": {
                  "type": "string",
                  "example": "https://example.com"
                },
                "phoneNumber": {
                  "type": "string",
                  "example": "+1234567890"
                },
                "copyCode": {
                  "type": "string",
                  "example": "4321"
                },
                "type": {
                  "type": "string",
                  "default": "reply",
                  "enum": [
                    "reply",
                    "url",
                    "call",
                    "copy"
                  ]
                }
              },
              "required": [
                "text",
                "type"
              ]
            }
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "header",
          "body",
          "footer",
          "buttons",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendContactVcard

**Metod & Yol:** `POST /api/sendContactVcard`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "contacts": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "vcard": {
                "type": "string",
                "example": "BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nORG:Company Name;\nTEL;type=CELL;type=VOICE;waid=911111111111:+91 11111 11111\nEND:VCARD",
                "description": "The vcard string"
              }
            },
            "required": [
              "vcard"
            ]
          },
          {
            "type": "object",
            "properties": {
              "fullName": {
                "type": "string",
                "example": "John Doe",
                "description": "The full name of the contact"
              },
              "organization": {
                "type": "string",
                "example": "Company Name",
                "description": "The organization of the contact"
              },
              "phoneNumber": {
                "type": "string",
                "example": "+91 11111 11111",
                "description": "The phone number of the contact"
              },
              "whatsappId": {
                "type": "string",
                "example": "911111111111",
                "description": "The whatsapp id of the contact. DO NOT add + or @c.us"
              },
              "vcard": {
                "type": "string",
                "default": null
              }
            },
            "required": [
              "fullName",
              "phoneNumber",
              "vcard"
            ]
          }
        ]
      }
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "contacts",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendContactVcard",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "contacts": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "properties": {
                    "vcard": {
                      "type": "string",
                      "example": "BEGIN:VCARD\nVERSION:3.0\nFN:Jane Doe\nORG:Company Name;\nTEL;type=CELL;type=VOICE;waid=911111111111:+91 11111 11111\nEND:VCARD",
                      "description": "The vcard string"
                    }
                  },
                  "required": [
                    "vcard"
                  ]
                },
                {
                  "type": "object",
                  "properties": {
                    "fullName": {
                      "type": "string",
                      "example": "John Doe",
                      "description": "The full name of the contact"
                    },
                    "organization": {
                      "type": "string",
                      "example": "Company Name",
                      "description": "The organization of the contact"
                    },
                    "phoneNumber": {
                      "type": "string",
                      "example": "+91 11111 11111",
                      "description": "The phone number of the contact"
                    },
                    "whatsappId": {
                      "type": "string",
                      "example": "911111111111",
                      "description": "The whatsapp id of the contact. DO NOT add + or @c.us"
                    },
                    "vcard": {
                      "type": "string",
                      "default": null
                    }
                  },
                  "required": [
                    "fullName",
                    "phoneNumber",
                    "vcard"
                  ]
                }
              ]
            }
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "contacts",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendFile

**Metod & Yol:** `POST /api/sendFile`

**Açıqlama:** Send a file

**Ətraflı:** Either from an URL or base64 data - look at the request schemas for details.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "caption": {
      "type": "string"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "file",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendFile",
  "description": "Send a file",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "caption": {
            "type": "string"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "file",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendImage

**Metod & Yol:** `POST /api/sendImage`

**Açıqlama:** Send an image

**Ətraflı:** Either from an URL or base64 data - look at the request schemas for details.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "caption": {
      "type": "string"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "file",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendImage",
  "description": "Send an image",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "caption": {
            "type": "string"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "file",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendLinkPreview_DEPRECATED

**Metod & Yol:** `POST /api/sendLinkPreview`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "session": {
      "type": "string",
      "default": "default"
    },
    "url": {
      "type": "string"
    },
    "title": {
      "type": "string"
    }
  },
  "required": [
    "chatId",
    "session",
    "url",
    "title"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendLinkPreview_DEPRECATED",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "session": {
            "type": "string",
            "default": "default"
          },
          "url": {
            "type": "string"
          },
          "title": {
            "type": "string"
          }
        },
        "required": [
          "chatId",
          "session",
          "url",
          "title"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendList

**Metod & Yol:** `POST /api/sendList`

**Açıqlama:** Send a list message (interactive)

**Ətraflı:** Send a List message with sections and rows

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "message": {
      "example": {
        "title": "Simple Menu",
        "description": "Please choose an option",
        "footer": "Thank you!",
        "button": "Choose",
        "sections": [
          {
            "title": "Main",
            "rows": [
              {
                "title": "Option 1",
                "rowId": "option1",
                "description": null
              },
              {
                "title": "Option 2",
                "rowId": "option2",
                "description": null
              },
              {
                "title": "Option 3",
                "rowId": "option3",
                "description": null
              }
            ]
          }
        ]
      },
      "allOf": [
        {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "example": "Example List"
            },
            "description": {
              "type": "string",
              "example": "Choose one of the options"
            },
            "footer": {
              "type": "string",
              "example": "Footer note"
            },
            "button": {
              "type": "string",
              "example": "Select"
            },
            "sections": {
              "example": [
                {
                  "title": "Section 1",
                  "rows": [
                    {
                      "title": "Option 1",
                      "rowId": "option1",
                      "description": "Description 1"
                    },
                    {
                      "title": "Option 2",
                      "rowId": "option2",
                      "description": "Description 2"
                    }
                  ]
                }
              ],
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "example": "Menu"
                  },
                  "rows": {
                    "example": [
                      {
                        "title": "Option 1",
                        "rowId": "option1",
                        "description": "First option"
                      },
                      {
                        "title": "Option 2",
                        "rowId": "option2",
                        "description": "Second option"
                      }
                    ],
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "example": "Option 1"
                        },
                        "description": {
                          "type": "string",
                          "example": "Description of option 1"
                        },
                        "rowId": {
                          "type": "string",
                          "example": "option1"
                        }
                      },
                      "required": [
                        "title",
                        "rowId"
                      ]
                    }
                  }
                },
                "required": [
                  "title",
                  "rows"
                ]
              }
            }
          },
          "required": [
            "title",
            "button",
            "sections"
          ]
        }
      ]
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "message",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendList",
  "description": "Send a list message (interactive)",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "message": {
            "example": {
              "title": "Simple Menu",
              "description": "Please choose an option",
              "footer": "Thank you!",
              "button": "Choose",
              "sections": [
                {
                  "title": "Main",
                  "rows": [
                    {
                      "title": "Option 1",
                      "rowId": "option1",
                      "description": null
                    },
                    {
                      "title": "Option 2",
                      "rowId": "option2",
                      "description": null
                    },
                    {
                      "title": "Option 3",
                      "rowId": "option3",
                      "description": null
                    }
                  ]
                }
              ]
            },
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "example": "Example List"
                  },
                  "description": {
                    "type": "string",
                    "example": "Choose one of the options"
                  },
                  "footer": {
                    "type": "string",
                    "example": "Footer note"
                  },
                  "button": {
                    "type": "string",
                    "example": "Select"
                  },
                  "sections": {
                    "example": [
                      {
                        "title": "Section 1",
                        "rows": [
                          {
                            "title": "Option 1",
                            "rowId": "option1",
                            "description": "Description 1"
                          },
                          {
                            "title": "Option 2",
                            "rowId": "option2",
                            "description": "Description 2"
                          }
                        ]
                      }
                    ],
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "example": "Menu"
                        },
                        "rows": {
                          "example": [
                            {
                              "title": "Option 1",
                              "rowId": "option1",
                              "description": "First option"
                            },
                            {
                              "title": "Option 2",
                              "rowId": "option2",
                              "description": "Second option"
                            }
                          ],
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "title": {
                                "type": "string",
                                "example": "Option 1"
                              },
                              "description": {
                                "type": "string",
                                "example": "Description of option 1"
                              },
                              "rowId": {
                                "type": "string",
                                "example": "option1"
                              }
                            },
                            "required": [
                              "title",
                              "rowId"
                            ]
                          }
                        }
                      },
                      "required": [
                        "title",
                        "rows"
                      ]
                    }
                  }
                },
                "required": [
                  "title",
                  "button",
                  "sections"
                ]
              }
            ]
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "message",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendLocation

**Metod & Yol:** `POST /api/sendLocation`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "latitude": {
      "type": "number",
      "example": 38.8937255
    },
    "longitude": {
      "type": "number",
      "example": -77.0969763
    },
    "title": {
      "type": "string",
      "example": "Our office"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "latitude",
    "longitude",
    "title",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendLocation",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "latitude": {
            "type": "number",
            "example": 38.8937255
          },
          "longitude": {
            "type": "number",
            "example": -77.0969763
          },
          "title": {
            "type": "string",
            "example": "Our office"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "latitude",
          "longitude",
          "title",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendPoll

**Metod & Yol:** `POST /api/sendPoll`

**Açıqlama:** Send a poll with options

**Ətraflı:** You can use it as buttons or list replacement

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "poll": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "example": "How are you?"
        },
        "options": {
          "example": [
            "Awesome!",
            "Good!",
            "Not bad!"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "multipleAnswers": {
          "type": "object",
          "default": false
        }
      },
      "required": [
        "name",
        "options",
        "multipleAnswers"
      ]
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "poll",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendPoll",
  "description": "Send a poll with options",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "poll": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "example": "How are you?"
              },
              "options": {
                "example": [
                  "Awesome!",
                  "Good!",
                  "Not bad!"
                ],
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "multipleAnswers": {
                "type": "object",
                "default": false
              }
            },
            "required": [
              "name",
              "options",
              "multipleAnswers"
            ]
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "poll",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendPollVote

**Metod & Yol:** `POST /api/sendPollVote`

**Açıqlama:** Vote on a poll

**Ətraflı:** Cast vote(s) on an existing poll message

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "pollMessageId": {
      "type": "string",
      "description": "The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "pollServerId": {
      "type": "number",
      "description": "Only for Channels - server message id (if known); if omitted, API may look it up in the storage",
      "example": null
    },
    "votes": {
      "type": "array",
      "items": {
        "required": true,
        "description": "Poll options you are voting for",
        "example": "Awesome!",
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "pollMessageId",
    "votes",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendPollVote",
  "description": "Vote on a poll",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "pollMessageId": {
            "type": "string",
            "description": "The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS",
            "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
          },
          "pollServerId": {
            "type": "number",
            "description": "Only for Channels - server message id (if known); if omitted, API may look it up in the storage",
            "example": null
          },
          "votes": {
            "type": "array",
            "items": {
              "required": true,
              "description": "Poll options you are voting for",
              "example": "Awesome!",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "pollMessageId",
          "votes",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendSeen

**Metod & Yol:** `POST /api/sendSeen`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "messageId": {
      "type": "string",
      "example": null,
      "deprecated": true
    },
    "messageIds": {
      "example": [
        "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
      ],
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "participant": {
      "type": "string",
      "example": "11111111111@c.us",
      "default": null,
      "description": "NOWEB engine only - the ID of the user that sent the message (undefined for individual chats)"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendSeen",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "messageId": {
            "type": "string",
            "example": null,
            "deprecated": true
          },
          "messageIds": {
            "example": [
              "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "participant": {
            "type": "string",
            "example": "11111111111@c.us",
            "default": null,
            "description": "NOWEB engine only - the ID of the user that sent the message (undefined for individual chats)"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendTextGet

**Metod & Yol:** `GET /api/sendText`

**Açıqlama:** Send a text message

**Sorğu Parametrləri:**
- `phone` [query] (tələb olunur): 
- `text` [query] (tələb olunur): 
- `session` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendTextGet",
  "description": "Send a text message",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "Location: query"
      },
      "text": {
        "type": "string",
        "description": "Location: query"
      },
      "session": {
        "default": "default",
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "phone",
      "session",
      "text"
    ]
  }
}
```

## waha_ChattingController_sendText

**Metod & Yol:** `POST /api/sendText`

**Açıqlama:** Send a text message

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "text": {
      "type": "string",
      "default": "Hi there!"
    },
    "linkPreview": {
      "type": "boolean",
      "default": true
    },
    "linkPreviewHighQuality": {
      "type": "boolean",
      "default": false
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "text",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Message ID",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "timestamp": {
      "type": "number",
      "description": "Unix timestamp for when the message was created",
      "example": 1666943582
    },
    "from": {
      "type": "string",
      "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
      "example": "11111111111@c.us"
    },
    "fromMe": {
      "type": "boolean",
      "description": "Indicates if the message was sent by the current user"
    },
    "source": {
      "enum": [
        "api",
        "app"
      ],
      "type": "string",
      "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
      "example": "api"
    },
    "to": {
      "type": "string",
      "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
      "example": "11111111111@c.us"
    },
    "participant": {
      "type": "string",
      "description": "For groups - participant who sent the message"
    },
    "body": {
      "type": "string",
      "description": "Message content"
    },
    "hasMedia": {
      "type": "boolean",
      "description": "Indicates if the message has media available for download"
    },
    "media": {
      "description": "Media object for the message if any and downloaded",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "The URL for the media in the message if any",
              "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
            },
            "mimetype": {
              "type": "string",
              "description": "mimetype for the media in the message if any",
              "example": "audio/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "The original filename in mediaUrl in the message if any",
              "example": "example.pdf"
            },
            "s3": {
              "description": "S3 attributes for the media in the message if you are using S3 media storage",
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "Bucket": {
                      "type": "string",
                      "description": "The name of the S3 bucket",
                      "example": "my-bucket"
                    },
                    "Key": {
                      "type": "string",
                      "description": "The key of the object in the S3 bucket",
                      "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                    }
                  },
                  "required": [
                    "Bucket",
                    "Key"
                  ]
                }
              ]
            },
            "error": {
              "type": "object",
              "description": "Error message if there's an error downloading the media",
              "example": null
            }
          }
        }
      ]
    },
    "mediaUrl": {
      "type": "string",
      "description": "Use `media.url` instead! The URL for the media in the message if any",
      "deprecated": true,
      "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
    },
    "ack": {
      "enum": [
        -1,
        0,
        1,
        2,
        3,
        4
      ],
      "type": "number",
      "description": "ACK status for the message"
    },
    "ackName": {
      "type": "string",
      "description": "ACK status name for the message"
    },
    "author": {
      "type": "string",
      "description": "If the message was sent to a group, this field will contain the user that sent the message."
    },
    "location": {
      "description": "Location information contained in the message, if the message is type \"location\"",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "latitude": {
              "type": "string"
            },
            "longitude": {
              "type": "string"
            },
            "live": {
              "type": "boolean"
            },
            "name": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            }
          },
          "required": [
            "latitude",
            "longitude",
            "live"
          ]
        }
      ]
    },
    "vCards": {
      "description": "List of vCards contained in the message.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "_data": {
      "type": "object",
      "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
    },
    "replyTo": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Message ID",
          "example": "AAAAAAAAAAAAAAAAAAAA"
        },
        "participant": {
          "type": "string",
          "example": "11111111111@c.us"
        },
        "body": {
          "type": "string",
          "example": "Hello!"
        },
        "_data": {
          "type": "object",
          "description": "Raw data from reply's message"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  "required": [
    "id",
    "timestamp",
    "from",
    "fromMe",
    "source",
    "to",
    "participant",
    "body",
    "hasMedia",
    "mediaUrl",
    "ack",
    "ackName"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendText",
  "description": "Send a text message",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "text": {
            "type": "string",
            "default": "Hi there!"
          },
          "linkPreview": {
            "type": "boolean",
            "default": true
          },
          "linkPreviewHighQuality": {
            "type": "boolean",
            "default": false
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "text",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendVideo

**Metod & Yol:** `POST /api/sendVideo`

**Açıqlama:** Send a video

**Ətraflı:** Either from an URL or base64 data - look at the request schemas for details.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "video/mp4",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "video.mp4",
              "description": "Document file name. Optional"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
            }
          },
          "required": [
            "mimetype",
            "filename",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "video/mp4",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "video.mp4",
              "description": "Document file name. Optional"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHYhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAciEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAgAaq3yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq7yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq/yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAjIetKI9/zIAAAAwAAAwAAAwAAAwAVW8H+swAAAwAAAwAAEvcAAAAgAatHyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAgAatLyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAhAatPyJf/AAADAAADAAADAAADAByn5+AAAAMAAAMABN2QAAAAIiHtiiNf5EAAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMCgiAAAAAhAavXyLf/AAADAAADAAADAAADAAADAAADAAADAAADAO6YAAAAIQGr28i3/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwDumAAAACEBq9/It/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMA7pgAAAAiIe/aIt+HAAADAAADAAADAAADAAADAAADAAADAAADAAmagAAAACEBrGfIl/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMBF3AAAAAhAaxryJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfSEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkAAAAhAaxvyJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwAAAAIQGsc8iX/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwEXcAAAAAEKIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI="
            }
          },
          "required": [
            "mimetype",
            "filename",
            "data"
          ]
        }
      ]
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "asNote": {
      "type": "boolean",
      "description": "Send as video note (aka instant or round video).",
      "example": false
    },
    "convert": {
      "type": "boolean",
      "description": "Convert the input file to the required format using ffmpeg before sending",
      "example": true
    },
    "caption": {
      "type": "string",
      "default": "Just watch at this!"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "file",
    "convert",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendVideo",
  "description": "Send a video",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "video/mp4",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "video.mp4",
                    "description": "Document file name. Optional"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "video/mp4",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "video.mp4",
                    "description": "Document file name. Optional"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHYhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAciEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAgAaq3yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq7yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq/yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAjIetKI9/zIAAAAwAAAwAAAwAAAwAVW8H+swAAAwAAAwAAEvcAAAAgAatHyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAgAatLyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAhAatPyJf/AAADAAADAAADAAADAByn5+AAAAMAAAMABN2QAAAAIiHtiiNf5EAAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMCgiAAAAAhAavXyLf/AAADAAADAAADAAADAAADAAADAAADAAADAO6YAAAAIQGr28i3/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwDumAAAACEBq9/It/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMA7pgAAAAiIe/aIt+HAAADAAADAAADAAADAAADAAADAAADAAADAAmagAAAACEBrGfIl/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMBF3AAAAAhAaxryJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfSEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkAAAAhAaxvyJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwAAAAIQGsc8iX/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwEXcAAAAAEKIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI="
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "data"
                ]
              }
            ]
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "asNote": {
            "type": "boolean",
            "description": "Send as video note (aka instant or round video).",
            "example": false
          },
          "convert": {
            "type": "boolean",
            "description": "Convert the input file to the required format using ffmpeg before sending",
            "example": true
          },
          "caption": {
            "type": "string",
            "default": "Just watch at this!"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "file",
          "convert",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_sendVoice

**Metod & Yol:** `POST /api/sendVoice`

**Açıqlama:** Send an voice message

**Ətraflı:** Either from an URL or base64 data - look at the request schemas for details.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "audio/ogg; codecs=opus",
              "description": "MIME type of the attachment."
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "audio/ogg; codecs=opus",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "voice-message.mp3",
              "description": "Document file name. Optional"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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VSO3pMrPlDI7//NkxP8g454UCuJGUWisGIZWQwUgpHZyhg4kNUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxP4ibDnMAOGEzFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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"
            }
          },
          "required": [
            "mimetype",
            "filename",
            "data"
          ]
        }
      ]
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "convert": {
      "type": "boolean",
      "description": "Convert the input file to the required format using ffmpeg before sending",
      "example": true
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "file",
    "convert",
    "session"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_sendVoice",
  "description": "Send an voice message",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "audio/ogg; codecs=opus",
                    "description": "MIME type of the attachment."
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "audio/ogg; codecs=opus",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "voice-message.mp3",
                    "description": "Document file name. Optional"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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VSO3pMrPlDI7//NkxP8g454UCuJGUWisGIZWQwUgpHZyhg4kNUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxP4ibDnMAOGEzFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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"
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "data"
                ]
              }
            ]
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "convert": {
            "type": "boolean",
            "description": "Convert the input file to the required format using ffmpeg before sending",
            "example": true
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "file",
          "convert",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ServerDebugController_browserTrace

**Metod & Yol:** `GET /api/server/debug/browser/trace/{session}`

**Açıqlama:** Collect and get a trace.json for Chrome DevTools 

**Ətraflı:** Uses https://pptr.dev/api/puppeteer.tracing

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `seconds` [query] (tələb olunur): How many seconds to trace
- `categories` [query] (tələb olunur): Categories to trace (all by default)

**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerDebugController_browserTrace",
  "description": "Collect and get a trace.json for Chrome DevTools ",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "seconds": {
        "default": 30,
        "example": 30,
        "type": "number",
        "description": "Location: query | How many seconds to trace"
      },
      "categories": {
        "default": [
          "*"
        ],
        "example": [
          "*"
        ],
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Location: query | Categories to trace (all by default)"
      }
    },
    "required": [
      "categories",
      "seconds",
      "session"
    ]
  }
}
```

## waha_ServerDebugController_heapsnapshot

**Metod & Yol:** `GET /api/server/debug/heapsnapshot`

**Açıqlama:** Return a heapsnapshot for the current nodejs process

**Ətraflı:** Return a heapsnapshot of the server's memory

**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerDebugController_heapsnapshot",
  "description": "Return a heapsnapshot for the current nodejs process",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_ServerController_environment

**Metod & Yol:** `GET /api/server/environment`

**Açıqlama:** Get the server environment

**Sorğu Parametrləri:**
- `all` [query]: Include all environment variables

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerController_environment",
  "description": "Get the server environment",
  "parameters": {
    "type": "object",
    "properties": {
      "all": {
        "default": false,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Include all environment variables"
      }
    }
  }
}
```

## waha_ServerController_status

**Metod & Yol:** `GET /api/server/status`

**Açıqlama:** Get the server status

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "startTimestamp": {
      "type": "number",
      "example": 1723788847247,
      "description": "The timestamp when the server started (milliseconds)."
    },
    "uptime": {
      "type": "number",
      "example": 3600000,
      "description": "The uptime of the server in milliseconds."
    },
    "worker": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "example": "waha",
          "description": "The worker ID."
        }
      },
      "required": [
        "id"
      ]
    }
  },
  "required": [
    "startTimestamp",
    "uptime",
    "worker"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerController_status",
  "description": "Get the server status",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_ServerController_stop

**Metod & Yol:** `POST /api/server/stop`

**Açıqlama:** Stop (and restart) the server

**Ətraflı:** If you're using docker, after calling this endpoint Docker will start a new container, so you can use this endpoint to restart the server

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "force": {
      "type": "boolean",
      "default": false,
      "example": false,
      "description": "By default, it gracefully stops the server, but you can force it to terminate immediately."
    }
  }
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "stopping": {
      "type": "boolean",
      "default": true,
      "example": true,
      "description": "Always 'true' if the server is stopping."
    }
  },
  "required": [
    "stopping"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerController_stop",
  "description": "Stop (and restart) the server",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "force": {
            "type": "boolean",
            "default": false,
            "example": false,
            "description": "By default, it gracefully stops the server, but you can force it to terminate immediately."
          }
        }
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ServerController_get

**Metod & Yol:** `GET /api/server/version`

**Açıqlama:** Get the version of the server

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "example": "YYYY.MM.BUILD"
    },
    "engine": {
      "type": "string",
      "example": "WEBJS"
    },
    "tier": {
      "type": "string",
      "example": "PLUS"
    },
    "browser": {
      "type": "string",
      "example": "/usr/path/to/bin/google-chrome"
    }
  },
  "required": [
    "version",
    "engine",
    "tier",
    "browser"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ServerController_get",
  "description": "Get the version of the server",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_SessionsController_list

**Metod & Yol:** `GET /api/sessions`

**Açıqlama:** List all sessions

**Sorğu Parametrləri:**
- `all` [query]: Return all sessions, including those that are in the STOPPED state.

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "example": "default",
        "description": "Session name (id)"
      },
      "me": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "lid": {
            "type": "string",
            "example": "123123@lid"
          },
          "jid": {
            "type": "string",
            "example": "123123:123@s.whatsapp.net",
            "description": "Your id with device number"
          },
          "pushName": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "pushName"
        ]
      },
      "assignedWorker": {
        "type": "string"
      },
      "presence": {
        "type": "object"
      },
      "timestamps": {
        "type": "object",
        "properties": {
          "activity": {
            "required": true,
            "type": "number",
            "nullable": true
          }
        }
      },
      "status": {
        "enum": [
          "STOPPED",
          "STARTING",
          "SCAN_QR_CODE",
          "WORKING",
          "FAILED"
        ],
        "type": "string"
      },
      "config": {
        "type": "object",
        "properties": {
          "metadata": {
            "type": "object",
            "example": {
              "user.id": "123",
              "user.email": "email@example.com"
            },
            "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
          },
          "proxy": {
            "example": null,
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "server": {
                    "type": "string",
                    "example": "localhost:3128"
                  },
                  "username": {
                    "type": "string",
                    "example": null
                  },
                  "password": {
                    "type": "string",
                    "example": null
                  }
                },
                "required": [
                  "server"
                ]
              }
            ]
          },
          "debug": {
            "type": "boolean",
            "default": false
          },
          "ignore": {
            "example": {
              "status": null,
              "groups": null,
              "channels": null
            },
            "description": "Ignore some events related to specific chats",
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "boolean",
                    "description": "Ignore a status@broadcast (stories) events"
                  },
                  "groups": {
                    "type": "boolean",
                    "description": "Ignore groups events"
                  },
                  "channels": {
                    "type": "boolean",
                    "description": "Ignore channels events"
                  },
                  "broadcast": {
                    "type": "boolean",
                    "description": "Ignore broadcast events (broadcast list and status)"
                  }
                }
              }
            ]
          },
          "noweb": {
            "example": {
              "store": {
                "enabled": true,
                "fullSync": false
              }
            },
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "markOnline": {
                    "type": "boolean",
                    "default": true,
                    "description": "Mark the session as online when it connects to the server."
                  },
                  "store": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean",
                        "default": false,
                        "description": "Enable or disable the store for contacts, chats, and messages.",
                        "example": true
                      },
                      "fullSync": {
                        "type": "boolean",
                        "default": false,
                        "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                      }
                    },
                    "required": [
                      "enabled",
                      "fullSync"
                    ]
                  }
                },
                "required": [
                  "markOnline"
                ]
              }
            ]
          },
          "webjs": {
            "description": "WebJS-specific settings.",
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "tagsEventsOn": {
                    "type": "boolean",
                    "default": false,
                    "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                  }
                }
              }
            ]
          },
          "webhooks": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "url": {
                  "type": "string",
                  "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                  "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
                },
                "events": {
                  "example": [
                    "message",
                    "session.status"
                  ],
                  "type": "array",
                  "items": {
                    "type": "object"
                  }
                },
                "hmac": {
                  "example": null,
                  "allOf": [
                    {
                      "type": "object",
                      "properties": {
                        "key": {
                          "type": "string",
                          "example": "your-secret-key"
                        }
                      }
                    }
                  ]
                },
                "retries": {
                  "example": null,
                  "allOf": [
                    {
                      "type": "object",
                      "properties": {
                        "delaySeconds": {
                          "type": "number",
                          "example": 2
                        },
                        "attempts": {
                          "type": "number",
                          "example": 15
                        },
                        "policy": {
                          "enum": [
                            "linear",
                            "exponential",
                            "constant"
                          ],
                          "type": "string",
                          "example": "linear"
                        }
                      }
                    }
                  ]
                },
                "customHeaders": {
                  "example": null,
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "example": "X-My-Custom-Header"
                      },
                      "value": {
                        "type": "string",
                        "example": "Value"
                      }
                    },
                    "required": [
                      "name",
                      "value"
                    ]
                  }
                }
              },
              "required": [
                "url",
                "events"
              ]
            }
          }
        }
      }
    },
    "required": [
      "name",
      "presence",
      "timestamps",
      "status"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_list",
  "description": "List all sessions",
  "parameters": {
    "type": "object",
    "properties": {
      "all": {
        "example": false,
        "type": "boolean",
        "description": "Location: query | Return all sessions, including those that are in the STOPPED state."
      }
    }
  }
}
```

## waha_SessionsController_create

**Metod & Yol:** `POST /api/sessions`

**Açıqlama:** Create a session

**Ətraflı:** Create session a new session (and start it at the same time if required).

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 54,
      "pattern": "/^[a-zA-Z0-9_-]*$/",
      "example": "default",
      "description": "Session name (id)"
    },
    "start": {
      "type": "boolean",
      "description": "Start session after creation",
      "example": true,
      "default": true
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  }
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_create",
  "description": "Create a session",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "maxLength": 54,
            "pattern": "/^[a-zA-Z0-9_-]*$/",
            "example": "default",
            "description": "Session name (id)"
          },
          "start": {
            "type": "boolean",
            "description": "Start session after creation",
            "example": true,
            "default": true
          },
          "config": {
            "type": "object",
            "properties": {
              "metadata": {
                "type": "object",
                "example": {
                  "user.id": "123",
                  "user.email": "email@example.com"
                },
                "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
              },
              "proxy": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "server": {
                        "type": "string",
                        "example": "localhost:3128"
                      },
                      "username": {
                        "type": "string",
                        "example": null
                      },
                      "password": {
                        "type": "string",
                        "example": null
                      }
                    },
                    "required": [
                      "server"
                    ]
                  }
                ]
              },
              "debug": {
                "type": "boolean",
                "default": false
              },
              "ignore": {
                "example": {
                  "status": null,
                  "groups": null,
                  "channels": null
                },
                "description": "Ignore some events related to specific chats",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "boolean",
                        "description": "Ignore a status@broadcast (stories) events"
                      },
                      "groups": {
                        "type": "boolean",
                        "description": "Ignore groups events"
                      },
                      "channels": {
                        "type": "boolean",
                        "description": "Ignore channels events"
                      },
                      "broadcast": {
                        "type": "boolean",
                        "description": "Ignore broadcast events (broadcast list and status)"
                      }
                    }
                  }
                ]
              },
              "noweb": {
                "example": {
                  "store": {
                    "enabled": true,
                    "fullSync": false
                  }
                },
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "markOnline": {
                        "type": "boolean",
                        "default": true,
                        "description": "Mark the session as online when it connects to the server."
                      },
                      "store": {
                        "type": "object",
                        "properties": {
                          "enabled": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable or disable the store for contacts, chats, and messages.",
                            "example": true
                          },
                          "fullSync": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                          }
                        },
                        "required": [
                          "enabled",
                          "fullSync"
                        ]
                      }
                    },
                    "required": [
                      "markOnline"
                    ]
                  }
                ]
              },
              "webjs": {
                "description": "WebJS-specific settings.",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "tagsEventsOn": {
                        "type": "boolean",
                        "default": false,
                        "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                      }
                    }
                  }
                ]
              },
              "webhooks": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "url": {
                      "type": "string",
                      "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                      "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
                    },
                    "events": {
                      "example": [
                        "message",
                        "session.status"
                      ],
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "hmac": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "string",
                              "example": "your-secret-key"
                            }
                          }
                        }
                      ]
                    },
                    "retries": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "delaySeconds": {
                              "type": "number",
                              "example": 2
                            },
                            "attempts": {
                              "type": "number",
                              "example": 15
                            },
                            "policy": {
                              "enum": [
                                "linear",
                                "exponential",
                                "constant"
                              ],
                              "type": "string",
                              "example": "linear"
                            }
                          }
                        }
                      ]
                    },
                    "customHeaders": {
                      "example": null,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "example": "X-My-Custom-Header"
                          },
                          "value": {
                            "type": "string",
                            "example": "Value"
                          }
                        },
                        "required": [
                          "name",
                          "value"
                        ]
                      }
                    }
                  },
                  "required": [
                    "url",
                    "events"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_SessionsController_DEPRECATED_logout

**Metod & Yol:** `POST /api/sessions/logout`

**Açıqlama:** Logout and Delete session.

**Ətraflı:** Stop, Logout and Delete session.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    }
  },
  "required": [
    "name"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_DEPRECATED_logout",
  "description": "Logout and Delete session.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "default",
            "description": "Session name (id)"
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_SessionsController_DEPRACATED_start

**Metod & Yol:** `POST /api/sessions/start`

**Açıqlama:** Upsert and Start session

**Ətraflı:** Create session (if not exists) or update a config (if exists) and start it.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_DEPRACATED_start",
  "description": "Upsert and Start session",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "default",
            "description": "Session name (id)"
          },
          "config": {
            "type": "object",
            "properties": {
              "metadata": {
                "type": "object",
                "example": {
                  "user.id": "123",
                  "user.email": "email@example.com"
                },
                "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
              },
              "proxy": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "server": {
                        "type": "string",
                        "example": "localhost:3128"
                      },
                      "username": {
                        "type": "string",
                        "example": null
                      },
                      "password": {
                        "type": "string",
                        "example": null
                      }
                    },
                    "required": [
                      "server"
                    ]
                  }
                ]
              },
              "debug": {
                "type": "boolean",
                "default": false
              },
              "ignore": {
                "example": {
                  "status": null,
                  "groups": null,
                  "channels": null
                },
                "description": "Ignore some events related to specific chats",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "boolean",
                        "description": "Ignore a status@broadcast (stories) events"
                      },
                      "groups": {
                        "type": "boolean",
                        "description": "Ignore groups events"
                      },
                      "channels": {
                        "type": "boolean",
                        "description": "Ignore channels events"
                      },
                      "broadcast": {
                        "type": "boolean",
                        "description": "Ignore broadcast events (broadcast list and status)"
                      }
                    }
                  }
                ]
              },
              "noweb": {
                "example": {
                  "store": {
                    "enabled": true,
                    "fullSync": false
                  }
                },
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "markOnline": {
                        "type": "boolean",
                        "default": true,
                        "description": "Mark the session as online when it connects to the server."
                      },
                      "store": {
                        "type": "object",
                        "properties": {
                          "enabled": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable or disable the store for contacts, chats, and messages.",
                            "example": true
                          },
                          "fullSync": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                          }
                        },
                        "required": [
                          "enabled",
                          "fullSync"
                        ]
                      }
                    },
                    "required": [
                      "markOnline"
                    ]
                  }
                ]
              },
              "webjs": {
                "description": "WebJS-specific settings.",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "tagsEventsOn": {
                        "type": "boolean",
                        "default": false,
                        "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                      }
                    }
                  }
                ]
              },
              "webhooks": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "url": {
                      "type": "string",
                      "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                      "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
                    },
                    "events": {
                      "example": [
                        "message",
                        "session.status"
                      ],
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "hmac": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "string",
                              "example": "your-secret-key"
                            }
                          }
                        }
                      ]
                    },
                    "retries": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "delaySeconds": {
                              "type": "number",
                              "example": 2
                            },
                            "attempts": {
                              "type": "number",
                              "example": 15
                            },
                            "policy": {
                              "enum": [
                                "linear",
                                "exponential",
                                "constant"
                              ],
                              "type": "string",
                              "example": "linear"
                            }
                          }
                        }
                      ]
                    },
                    "customHeaders": {
                      "example": null,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "example": "X-My-Custom-Header"
                          },
                          "value": {
                            "type": "string",
                            "example": "Value"
                          }
                        },
                        "required": [
                          "name",
                          "value"
                        ]
                      }
                    }
                  },
                  "required": [
                    "url",
                    "events"
                  ]
                }
              }
            }
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_SessionsController_DEPRECATED_stop

**Metod & Yol:** `POST /api/sessions/stop`

**Açıqlama:** Stop (and Logout if asked) session

**Ətraflı:** Stop session and Logout by default.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "logout": {
      "type": "boolean",
      "default": false,
      "example": false,
      "description": "Stop and logout from the session."
    }
  },
  "required": [
    "name"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_DEPRECATED_stop",
  "description": "Stop (and Logout if asked) session",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "default",
            "description": "Session name (id)"
          },
          "logout": {
            "type": "boolean",
            "default": false,
            "example": false,
            "description": "Stop and logout from the session."
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_SessionsController_delete

**Metod & Yol:** `DELETE /api/sessions/{session}`

**Açıqlama:** Delete the session

**Ətraflı:** Delete the session with the given name. Stop and logout as well. Idempotent operation.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_delete",
  "description": "Delete the session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_get

**Metod & Yol:** `GET /api/sessions/{session}`

**Açıqlama:** Get session information

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "me": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "example": "11111111111@c.us"
        },
        "lid": {
          "type": "string",
          "example": "123123@lid"
        },
        "jid": {
          "type": "string",
          "example": "123123:123@s.whatsapp.net",
          "description": "Your id with device number"
        },
        "pushName": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "pushName"
      ]
    },
    "assignedWorker": {
      "type": "string"
    },
    "presence": {
      "type": "object"
    },
    "timestamps": {
      "type": "object",
      "properties": {
        "activity": {
          "required": true,
          "type": "number",
          "nullable": true
        }
      }
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "presence",
    "timestamps",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_get",
  "description": "Get session information",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_update

**Metod & Yol:** `PUT /api/sessions/{session}`

**Açıqlama:** Update a session

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  }
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_update",
  "description": "Update a session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "config": {
            "type": "object",
            "properties": {
              "metadata": {
                "type": "object",
                "example": {
                  "user.id": "123",
                  "user.email": "email@example.com"
                },
                "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
              },
              "proxy": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "server": {
                        "type": "string",
                        "example": "localhost:3128"
                      },
                      "username": {
                        "type": "string",
                        "example": null
                      },
                      "password": {
                        "type": "string",
                        "example": null
                      }
                    },
                    "required": [
                      "server"
                    ]
                  }
                ]
              },
              "debug": {
                "type": "boolean",
                "default": false
              },
              "ignore": {
                "example": {
                  "status": null,
                  "groups": null,
                  "channels": null
                },
                "description": "Ignore some events related to specific chats",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "boolean",
                        "description": "Ignore a status@broadcast (stories) events"
                      },
                      "groups": {
                        "type": "boolean",
                        "description": "Ignore groups events"
                      },
                      "channels": {
                        "type": "boolean",
                        "description": "Ignore channels events"
                      },
                      "broadcast": {
                        "type": "boolean",
                        "description": "Ignore broadcast events (broadcast list and status)"
                      }
                    }
                  }
                ]
              },
              "noweb": {
                "example": {
                  "store": {
                    "enabled": true,
                    "fullSync": false
                  }
                },
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "markOnline": {
                        "type": "boolean",
                        "default": true,
                        "description": "Mark the session as online when it connects to the server."
                      },
                      "store": {
                        "type": "object",
                        "properties": {
                          "enabled": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable or disable the store for contacts, chats, and messages.",
                            "example": true
                          },
                          "fullSync": {
                            "type": "boolean",
                            "default": false,
                            "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                          }
                        },
                        "required": [
                          "enabled",
                          "fullSync"
                        ]
                      }
                    },
                    "required": [
                      "markOnline"
                    ]
                  }
                ]
              },
              "webjs": {
                "description": "WebJS-specific settings.",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "tagsEventsOn": {
                        "type": "boolean",
                        "default": false,
                        "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                      }
                    }
                  }
                ]
              },
              "webhooks": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "url": {
                      "type": "string",
                      "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                      "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
                    },
                    "events": {
                      "example": [
                        "message",
                        "session.status"
                      ],
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "hmac": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "string",
                              "example": "your-secret-key"
                            }
                          }
                        }
                      ]
                    },
                    "retries": {
                      "example": null,
                      "allOf": [
                        {
                          "type": "object",
                          "properties": {
                            "delaySeconds": {
                              "type": "number",
                              "example": 2
                            },
                            "attempts": {
                              "type": "number",
                              "example": 15
                            },
                            "policy": {
                              "enum": [
                                "linear",
                                "exponential",
                                "constant"
                              ],
                              "type": "string",
                              "example": "linear"
                            }
                          }
                        }
                      ]
                    },
                    "customHeaders": {
                      "example": null,
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "example": "X-My-Custom-Header"
                          },
                          "value": {
                            "type": "string",
                            "example": "Value"
                          }
                        },
                        "required": [
                          "name",
                          "value"
                        ]
                      }
                    }
                  },
                  "required": [
                    "url",
                    "events"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_SessionsController_logout

**Metod & Yol:** `POST /api/sessions/{session}/logout`

**Açıqlama:** Logout from the session

**Ətraflı:** Logout the session, restart a session if it was not STOPPED

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_logout",
  "description": "Logout from the session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_getMe

**Metod & Yol:** `GET /api/sessions/{session}/me`

**Açıqlama:** Get information about the authenticated account

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "lid": {
      "type": "string",
      "example": "123123@lid"
    },
    "jid": {
      "type": "string",
      "example": "123123:123@s.whatsapp.net",
      "description": "Your id with device number"
    },
    "pushName": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "pushName"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_getMe",
  "description": "Get information about the authenticated account",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_restart

**Metod & Yol:** `POST /api/sessions/{session}/restart`

**Açıqlama:** Restart the session

**Ətraflı:** Restart the session with the given name.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_restart",
  "description": "Restart the session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_start

**Metod & Yol:** `POST /api/sessions/{session}/start`

**Açıqlama:** Start the session

**Ətraflı:** Start the session with the given name. The session must exist. Idempotent operation.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_start",
  "description": "Start the session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_SessionsController_stop

**Metod & Yol:** `POST /api/sessions/{session}/stop`

**Açıqlama:** Stop the session

**Ətraflı:** Stop the session with the given name. Idempotent operation.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "default",
      "description": "Session name (id)"
    },
    "status": {
      "enum": [
        "STOPPED",
        "STARTING",
        "SCAN_QR_CODE",
        "WORKING",
        "FAILED"
      ],
      "type": "string"
    },
    "config": {
      "type": "object",
      "properties": {
        "metadata": {
          "type": "object",
          "example": {
            "user.id": "123",
            "user.email": "email@example.com"
          },
          "description": "Metadata for the session. You'll get 'metadata' in all webhooks."
        },
        "proxy": {
          "example": null,
          "allOf": [
            {
              "type": "object",
              "properties": {
                "server": {
                  "type": "string",
                  "example": "localhost:3128"
                },
                "username": {
                  "type": "string",
                  "example": null
                },
                "password": {
                  "type": "string",
                  "example": null
                }
              },
              "required": [
                "server"
              ]
            }
          ]
        },
        "debug": {
          "type": "boolean",
          "default": false
        },
        "ignore": {
          "example": {
            "status": null,
            "groups": null,
            "channels": null
          },
          "description": "Ignore some events related to specific chats",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "status": {
                  "type": "boolean",
                  "description": "Ignore a status@broadcast (stories) events"
                },
                "groups": {
                  "type": "boolean",
                  "description": "Ignore groups events"
                },
                "channels": {
                  "type": "boolean",
                  "description": "Ignore channels events"
                },
                "broadcast": {
                  "type": "boolean",
                  "description": "Ignore broadcast events (broadcast list and status)"
                }
              }
            }
          ]
        },
        "noweb": {
          "example": {
            "store": {
              "enabled": true,
              "fullSync": false
            }
          },
          "allOf": [
            {
              "type": "object",
              "properties": {
                "markOnline": {
                  "type": "boolean",
                  "default": true,
                  "description": "Mark the session as online when it connects to the server."
                },
                "store": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable or disable the store for contacts, chats, and messages.",
                      "example": true
                    },
                    "fullSync": {
                      "type": "boolean",
                      "default": false,
                      "description": "Enable full sync on session initialization (when scanning QR code).\nFull sync will download all contacts, chats, and messages from the phone.\nIf disabled, only messages early than 90 days will be downloaded and some contacts may be missing."
                    }
                  },
                  "required": [
                    "enabled",
                    "fullSync"
                  ]
                }
              },
              "required": [
                "markOnline"
              ]
            }
          ]
        },
        "webjs": {
          "description": "WebJS-specific settings.",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tagsEventsOn": {
                  "type": "boolean",
                  "default": false,
                  "description": "Enable emission of special 'tag:*' engine events required for presence.update and message.ack.\nWARNING: Enabling this may have performance and stability impact. Disabled by default."
                }
              }
            }
          ]
        },
        "webhooks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "example": "https://webhook.site/11111111-1111-1111-1111-11111111",
                "description": "You can use https://docs.webhook.site/ to test webhooks and see the payload"
              },
              "events": {
                "example": [
                  "message",
                  "session.status"
                ],
                "type": "array",
                "items": {
                  "type": "object"
                }
              },
              "hmac": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "string",
                        "example": "your-secret-key"
                      }
                    }
                  }
                ]
              },
              "retries": {
                "example": null,
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "delaySeconds": {
                        "type": "number",
                        "example": 2
                      },
                      "attempts": {
                        "type": "number",
                        "example": 15
                      },
                      "policy": {
                        "enum": [
                          "linear",
                          "exponential",
                          "constant"
                        ],
                        "type": "string",
                        "example": "linear"
                      }
                    }
                  }
                ]
              },
              "customHeaders": {
                "example": null,
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "example": "X-My-Custom-Header"
                    },
                    "value": {
                      "type": "string",
                      "example": "Value"
                    }
                  },
                  "required": [
                    "name",
                    "value"
                  ]
                }
              }
            },
            "required": [
              "url",
              "events"
            ]
          }
        }
      }
    }
  },
  "required": [
    "name",
    "status"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_SessionsController_stop",
  "description": "Stop the session",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChattingController_setStar

**Metod & Yol:** `PUT /api/star`

**Açıqlama:** Star or unstar a message

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "messageId": {
      "type": "string",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "star": {
      "type": "boolean"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "messageId",
    "chatId",
    "star",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_setStar",
  "description": "Star or unstar a message",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "messageId": {
            "type": "string",
            "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
          },
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "star": {
            "type": "boolean"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "messageId",
          "chatId",
          "star",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_startTyping

**Metod & Yol:** `POST /api/startTyping`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_startTyping",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_ChattingController_stopTyping

**Metod & Yol:** `POST /api/stopTyping`

**Açıqlama:** No summary provided.

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "session": {
      "type": "string",
      "default": "default"
    }
  },
  "required": [
    "chatId",
    "session"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChattingController_stopTyping",
  "description": "No summary provided.",
  "parameters": {
    "type": "object",
    "properties": {
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "session": {
            "type": "string",
            "default": "default"
          }
        },
        "required": [
          "chatId",
          "session"
        ]
      }
    },
    "required": [
      "body"
    ]
  }
}
```

## waha_VersionController_get

**Metod & Yol:** `GET /api/version`

**Açıqlama:** Get the server version 

**Ətraflı:** Use 'GET /api/server/version' instead 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "example": "YYYY.MM.BUILD"
    },
    "engine": {
      "type": "string",
      "example": "WEBJS"
    },
    "tier": {
      "type": "string",
      "example": "PLUS"
    },
    "browser": {
      "type": "string",
      "example": "/usr/path/to/bin/google-chrome"
    }
  },
  "required": [
    "version",
    "engine",
    "tier",
    "browser"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_VersionController_get",
  "description": "Get the server version ",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_AuthController_getQR

**Metod & Yol:** `GET /api/{session}/auth/qr`

**Açıqlama:** Get QR code for pairing WhatsApp API.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `format` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "mimetype": {
          "type": "string"
        },
        "data": {
          "type": "string"
        }
      },
      "required": [
        "mimetype",
        "data"
      ]
    },
    {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        }
      },
      "required": [
        "value"
      ]
    }
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_AuthController_getQR",
  "description": "Get QR code for pairing WhatsApp API.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "format": {
        "default": "image",
        "enum": [
          "image",
          "raw"
        ],
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "format",
      "session"
    ]
  }
}
```

## waha_AuthController_requestCode

**Metod & Yol:** `POST /api/{session}/auth/request-code`

**Açıqlama:** Request authentication code.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "phoneNumber": {
      "type": "string",
      "description": "Mobile phone number in international format",
      "example": "12132132130"
    },
    "method": {
      "type": "string",
      "description": "How would you like to receive the one time code for registration? |sms|voice. Leave empty for Web pairing.",
      "example": null
    }
  },
  "required": [
    "phoneNumber"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_AuthController_requestCode",
  "description": "Request authentication code.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "phoneNumber": {
            "type": "string",
            "description": "Mobile phone number in international format",
            "example": "12132132130"
          },
          "method": {
            "type": "string",
            "description": "How would you like to receive the one time code for registration? |sms|voice. Leave empty for Web pairing.",
            "example": null
          }
        },
        "required": [
          "phoneNumber"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ChannelsController_list

**Metod & Yol:** `GET /api/{session}/channels`

**Açıqlama:** Get list of know channels

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `role` [query]: 

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Newsletter id",
        "example": "123123123123@newsletter"
      },
      "name": {
        "type": "string",
        "description": "Channel name",
        "example": "Channel Name"
      },
      "invite": {
        "type": "string",
        "description": "Invite link",
        "example": "https://www.whatsapp.com/channel/111111111111111111111111"
      },
      "preview": {
        "type": "string",
        "description": "Preview for channel's picture",
        "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
      },
      "picture": {
        "type": "string",
        "description": "Channel's picture",
        "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
      },
      "role": {
        "enum": [
          "OWNER",
          "ADMIN",
          "SUBSCRIBER",
          "GUEST"
        ],
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "verified": {
        "type": "boolean"
      },
      "subscribersCount": {
        "type": "number"
      }
    },
    "required": [
      "id",
      "name",
      "invite",
      "role",
      "verified",
      "subscribersCount"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_list",
  "description": "Get list of know channels",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "role": {
        "enum": [
          "OWNER",
          "ADMIN",
          "SUBSCRIBER"
        ],
        "type": "string",
        "description": "Location: query"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChannelsController_create

**Metod & Yol:** `POST /api/{session}/channels`

**Açıqlama:** Create a new channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "Channel Name"
    },
    "description": {
      "type": "string",
      "example": "Channel Description"
    },
    "picture": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    }
  },
  "required": [
    "name"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Newsletter id",
      "example": "123123123123@newsletter"
    },
    "name": {
      "type": "string",
      "description": "Channel name",
      "example": "Channel Name"
    },
    "invite": {
      "type": "string",
      "description": "Invite link",
      "example": "https://www.whatsapp.com/channel/111111111111111111111111"
    },
    "preview": {
      "type": "string",
      "description": "Preview for channel's picture",
      "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
    },
    "picture": {
      "type": "string",
      "description": "Channel's picture",
      "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
    },
    "role": {
      "enum": [
        "OWNER",
        "ADMIN",
        "SUBSCRIBER",
        "GUEST"
      ],
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "verified": {
      "type": "boolean"
    },
    "subscribersCount": {
      "type": "number"
    }
  },
  "required": [
    "id",
    "name",
    "invite",
    "role",
    "verified",
    "subscribersCount"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_create",
  "description": "Create a new channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Channel Name"
          },
          "description": {
            "type": "string",
            "example": "Channel Description"
          },
          "picture": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ChannelsController_searchByText

**Metod & Yol:** `POST /api/{session}/channels/search/by-text`

**Açıqlama:** Search for channels (by text)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "default": "Donald Trump"
    },
    "categories": {
      "default": [],
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "limit": {
      "type": "number",
      "default": 50
    },
    "startCursor": {
      "type": "string",
      "default": ""
    }
  },
  "required": [
    "text",
    "categories",
    "limit",
    "startCursor"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "page": {
      "type": "object",
      "properties": {
        "startCursor": {
          "type": "string",
          "nullable": true
        },
        "endCursor": {
          "type": "string",
          "nullable": true
        },
        "hasNextPage": {
          "type": "boolean"
        },
        "hasPreviousPage": {
          "type": "boolean"
        }
      },
      "required": [
        "startCursor",
        "endCursor",
        "hasNextPage",
        "hasPreviousPage"
      ]
    },
    "channels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Newsletter id",
            "example": "123123123123@newsletter"
          },
          "name": {
            "type": "string",
            "description": "Channel name",
            "example": "Channel Name"
          },
          "invite": {
            "type": "string",
            "description": "Invite link",
            "example": "https://www.whatsapp.com/channel/111111111111111111111111"
          },
          "preview": {
            "type": "string",
            "description": "Preview for channel's picture",
            "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
          },
          "picture": {
            "type": "string",
            "description": "Channel's picture",
            "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
          },
          "description": {
            "type": "string"
          },
          "verified": {
            "type": "boolean"
          },
          "subscribersCount": {
            "type": "number"
          }
        },
        "required": [
          "id",
          "name",
          "invite",
          "verified",
          "subscribersCount"
        ]
      }
    }
  },
  "required": [
    "page",
    "channels"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_searchByText",
  "description": "Search for channels (by text)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "default": "Donald Trump"
          },
          "categories": {
            "default": [],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "limit": {
            "type": "number",
            "default": 50
          },
          "startCursor": {
            "type": "string",
            "default": ""
          }
        },
        "required": [
          "text",
          "categories",
          "limit",
          "startCursor"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ChannelsController_searchByView

**Metod & Yol:** `POST /api/{session}/channels/search/by-view`

**Açıqlama:** Search for channels (by view)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "view": {
      "type": "string",
      "default": "RECOMMENDED"
    },
    "countries": {
      "default": [
        "US"
      ],
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "categories": {
      "default": [],
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "limit": {
      "type": "number",
      "default": 50
    },
    "startCursor": {
      "type": "string",
      "default": ""
    }
  },
  "required": [
    "view",
    "countries",
    "categories",
    "limit",
    "startCursor"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "page": {
      "type": "object",
      "properties": {
        "startCursor": {
          "type": "string",
          "nullable": true
        },
        "endCursor": {
          "type": "string",
          "nullable": true
        },
        "hasNextPage": {
          "type": "boolean"
        },
        "hasPreviousPage": {
          "type": "boolean"
        }
      },
      "required": [
        "startCursor",
        "endCursor",
        "hasNextPage",
        "hasPreviousPage"
      ]
    },
    "channels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Newsletter id",
            "example": "123123123123@newsletter"
          },
          "name": {
            "type": "string",
            "description": "Channel name",
            "example": "Channel Name"
          },
          "invite": {
            "type": "string",
            "description": "Invite link",
            "example": "https://www.whatsapp.com/channel/111111111111111111111111"
          },
          "preview": {
            "type": "string",
            "description": "Preview for channel's picture",
            "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
          },
          "picture": {
            "type": "string",
            "description": "Channel's picture",
            "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
          },
          "description": {
            "type": "string"
          },
          "verified": {
            "type": "boolean"
          },
          "subscribersCount": {
            "type": "number"
          }
        },
        "required": [
          "id",
          "name",
          "invite",
          "verified",
          "subscribersCount"
        ]
      }
    }
  },
  "required": [
    "page",
    "channels"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_searchByView",
  "description": "Search for channels (by view)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "view": {
            "type": "string",
            "default": "RECOMMENDED"
          },
          "countries": {
            "default": [
              "US"
            ],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "categories": {
            "default": [],
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "limit": {
            "type": "number",
            "default": 50
          },
          "startCursor": {
            "type": "string",
            "default": ""
          }
        },
        "required": [
          "view",
          "countries",
          "categories",
          "limit",
          "startCursor"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ChannelsController_getSearchCategories

**Metod & Yol:** `GET /api/{session}/channels/search/categories`

**Açıqlama:** Get list of categories for channel search

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "value": {
        "type": "string"
      },
      "name": {
        "type": "string"
      }
    },
    "required": [
      "value",
      "name"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_getSearchCategories",
  "description": "Get list of categories for channel search",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChannelsController_getSearchCountries

**Metod & Yol:** `GET /api/{session}/channels/search/countries`

**Açıqlama:** Get list of countries for channel search

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string"
      },
      "name": {
        "type": "string"
      }
    },
    "required": [
      "code",
      "name"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_getSearchCountries",
  "description": "Get list of countries for channel search",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChannelsController_getSearchViews

**Metod & Yol:** `GET /api/{session}/channels/search/views`

**Açıqlama:** Get list of views for channel search

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "value": {
        "type": "string"
      },
      "name": {
        "type": "string"
      }
    },
    "required": [
      "value",
      "name"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_getSearchViews",
  "description": "Get list of views for channel search",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChannelsController_delete

**Metod & Yol:** `DELETE /api/{session}/channels/{id}`

**Açıqlama:** Delete the channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_delete",
  "description": "Delete the channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChannelsController_get

**Metod & Yol:** `GET /api/{session}/channels/{id}`

**Açıqlama:** Get the channel info

**Ətraflı:** You can use either id (123@newsletter) OR invite code (https://www.whatsapp.com/channel/123)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID or invite code from invite link https://www.whatsapp.com/channel/11111

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Newsletter id",
      "example": "123123123123@newsletter"
    },
    "name": {
      "type": "string",
      "description": "Channel name",
      "example": "Channel Name"
    },
    "invite": {
      "type": "string",
      "description": "Invite link",
      "example": "https://www.whatsapp.com/channel/111111111111111111111111"
    },
    "preview": {
      "type": "string",
      "description": "Preview for channel's picture",
      "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
    },
    "picture": {
      "type": "string",
      "description": "Channel's picture",
      "example": "https://mmg.whatsapp.net/m1/v/t24/An&_nc_cat=10"
    },
    "role": {
      "enum": [
        "OWNER",
        "ADMIN",
        "SUBSCRIBER",
        "GUEST"
      ],
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "verified": {
      "type": "boolean"
    },
    "subscribersCount": {
      "type": "number"
    }
  },
  "required": [
    "id",
    "name",
    "invite",
    "role",
    "verified",
    "subscribersCount"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_get",
  "description": "Get the channel info",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID or invite code from invite link https://www.whatsapp.com/channel/11111"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChannelsController_follow

**Metod & Yol:** `POST /api/{session}/channels/{id}/follow`

**Açıqlama:** Follow the channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_follow",
  "description": "Follow the channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChannelsController_previewChannelMessages

**Metod & Yol:** `GET /api/{session}/channels/{id}/messages/preview`

**Açıqlama:** Preview channel messages

**Ətraflı:** You can use either invite code (https://www.whatsapp.com/channel/123) or (123)ORChannel ID (123@newsletter).

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Channel id or invite code
- `downloadMedia` [query] (tələb olunur): 
- `limit` [query] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "reactions": {
        "type": "object",
        "example": {
          "👍": 10,
          "❤️": 5
        },
        "additionalProperties": {
          "type": "number"
        }
      },
      "message": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Message ID",
            "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
          },
          "timestamp": {
            "type": "number",
            "description": "Unix timestamp for when the message was created",
            "example": 1666943582
          },
          "from": {
            "type": "string",
            "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
            "example": "11111111111@c.us"
          },
          "fromMe": {
            "type": "boolean",
            "description": "Indicates if the message was sent by the current user"
          },
          "source": {
            "enum": [
              "api",
              "app"
            ],
            "type": "string",
            "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
            "example": "api"
          },
          "to": {
            "type": "string",
            "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
            "example": "11111111111@c.us"
          },
          "participant": {
            "type": "string",
            "description": "For groups - participant who sent the message"
          },
          "body": {
            "type": "string",
            "description": "Message content"
          },
          "hasMedia": {
            "type": "boolean",
            "description": "Indicates if the message has media available for download"
          },
          "media": {
            "description": "Media object for the message if any and downloaded",
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "url": {
                    "type": "string",
                    "description": "The URL for the media in the message if any",
                    "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                  },
                  "mimetype": {
                    "type": "string",
                    "description": "mimetype for the media in the message if any",
                    "example": "audio/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "The original filename in mediaUrl in the message if any",
                    "example": "example.pdf"
                  },
                  "s3": {
                    "description": "S3 attributes for the media in the message if you are using S3 media storage",
                    "allOf": [
                      {
                        "type": "object",
                        "properties": {
                          "Bucket": {
                            "type": "string",
                            "description": "The name of the S3 bucket",
                            "example": "my-bucket"
                          },
                          "Key": {
                            "type": "string",
                            "description": "The key of the object in the S3 bucket",
                            "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                          }
                        },
                        "required": [
                          "Bucket",
                          "Key"
                        ]
                      }
                    ]
                  },
                  "error": {
                    "type": "object",
                    "description": "Error message if there's an error downloading the media",
                    "example": null
                  }
                }
              }
            ]
          },
          "mediaUrl": {
            "type": "string",
            "description": "Use `media.url` instead! The URL for the media in the message if any",
            "deprecated": true,
            "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
          },
          "ack": {
            "enum": [
              -1,
              0,
              1,
              2,
              3,
              4
            ],
            "type": "number",
            "description": "ACK status for the message"
          },
          "ackName": {
            "type": "string",
            "description": "ACK status name for the message"
          },
          "author": {
            "type": "string",
            "description": "If the message was sent to a group, this field will contain the user that sent the message."
          },
          "location": {
            "description": "Location information contained in the message, if the message is type \"location\"",
            "allOf": [
              {
                "type": "object",
                "properties": {
                  "latitude": {
                    "type": "string"
                  },
                  "longitude": {
                    "type": "string"
                  },
                  "live": {
                    "type": "boolean"
                  },
                  "name": {
                    "type": "string"
                  },
                  "address": {
                    "type": "string"
                  },
                  "url": {
                    "type": "string"
                  },
                  "description": {
                    "type": "string"
                  },
                  "thumbnail": {
                    "type": "string"
                  }
                },
                "required": [
                  "latitude",
                  "longitude",
                  "live"
                ]
              }
            ]
          },
          "vCards": {
            "description": "List of vCards contained in the message.",
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "_data": {
            "type": "object",
            "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
          },
          "replyTo": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "Message ID",
                "example": "AAAAAAAAAAAAAAAAAAAA"
              },
              "participant": {
                "type": "string",
                "example": "11111111111@c.us"
              },
              "body": {
                "type": "string",
                "example": "Hello!"
              },
              "_data": {
                "type": "object",
                "description": "Raw data from reply's message"
              }
            },
            "required": [
              "id"
            ]
          }
        },
        "required": [
          "id",
          "timestamp",
          "from",
          "fromMe",
          "source",
          "to",
          "participant",
          "body",
          "hasMedia",
          "mediaUrl",
          "ack",
          "ackName"
        ]
      },
      "viewCount": {
        "type": "number"
      }
    },
    "required": [
      "reactions",
      "message",
      "viewCount"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_previewChannelMessages",
  "description": "Preview channel messages",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "0029Va4K0PZ5a245NkngBA2M",
        "description": "Location: path | Channel id or invite code"
      },
      "downloadMedia": {
        "default": false,
        "type": "boolean",
        "description": "Location: query"
      },
      "limit": {
        "default": 10,
        "type": "number",
        "description": "Location: query"
      }
    },
    "required": [
      "downloadMedia",
      "id",
      "limit",
      "session"
    ]
  }
}
```

## waha_ChannelsController_mute

**Metod & Yol:** `POST /api/{session}/channels/{id}/mute`

**Açıqlama:** Mute the channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_mute",
  "description": "Mute the channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChannelsController_unfollow

**Metod & Yol:** `POST /api/{session}/channels/{id}/unfollow`

**Açıqlama:** Unfollow the channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_unfollow",
  "description": "Unfollow the channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChannelsController_unmute

**Metod & Yol:** `POST /api/{session}/channels/{id}/unmute`

**Açıqlama:** Unmute the channel.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): WhatsApp Channel ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChannelsController_unmute",
  "description": "Unmute the channel.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "default": "123123123@newsletter",
        "description": "Location: path | WhatsApp Channel ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_ChatsController_getChats

**Metod & Yol:** `GET /api/{session}/chats`

**Açıqlama:** Get chats

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `sortBy` [query]: Sort by field
- `sortOrder` [query]: Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
- `limit` [query]: 
- `offset` [query]: 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_getChats",
  "description": "Get chats",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "sortBy": {
        "enum": [
          "conversationTimestamp",
          "id",
          "name"
        ],
        "type": "string",
        "description": "Location: query | Sort by field"
      },
      "sortOrder": {
        "enum": [
          "desc",
          "asc"
        ],
        "type": "string",
        "description": "Location: query | Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)"
      },
      "limit": {
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChatsController_getChatsOverview

**Metod & Yol:** `GET /api/{session}/chats/overview`

**Açıqlama:** Get chats overview. Includes all necessary things to build UI "your chats overview" page - chat id, name, picture, last message. Sorting by last message timestamp

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `limit` [query]: 
- `offset` [query]: 
- `ids` [query]: Filter by chat ids

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string",
        "nullable": true
      },
      "picture": {
        "type": "string",
        "nullable": true
      },
      "lastMessage": {
        "type": "object"
      },
      "_chat": {
        "type": "object"
      }
    },
    "required": [
      "id",
      "name",
      "picture",
      "lastMessage",
      "_chat"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_getChatsOverview",
  "description": "Get chats overview. Includes all necessary things to build UI \"your chats overview\" page - chat id, name, picture, last message. Sorting by last message timestamp",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "limit": {
        "default": 20,
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      },
      "ids": {
        "example": [
          "111111111@c.us"
        ],
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Location: query | Filter by chat ids"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ChatsController_postChatsOverview

**Metod & Yol:** `POST /api/{session}/chats/overview`

**Açıqlama:** Get chats overview. Use POST if you have too many "ids" params - GET can limit it

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "pagination": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "default": 20
        },
        "offset": {
          "type": "number"
        }
      }
    },
    "filter": {
      "type": "object",
      "properties": {
        "ids": {
          "description": "Filter by chat ids",
          "example": [
            "111111111@c.us"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    }
  },
  "required": [
    "pagination",
    "filter"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "name": {
        "type": "string",
        "nullable": true
      },
      "picture": {
        "type": "string",
        "nullable": true
      },
      "lastMessage": {
        "type": "object"
      },
      "_chat": {
        "type": "object"
      }
    },
    "required": [
      "id",
      "name",
      "picture",
      "lastMessage",
      "_chat"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_postChatsOverview",
  "description": "Get chats overview. Use POST if you have too many \"ids\" params - GET can limit it",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "pagination": {
            "type": "object",
            "properties": {
              "limit": {
                "type": "number",
                "default": 20
              },
              "offset": {
                "type": "number"
              }
            }
          },
          "filter": {
            "type": "object",
            "properties": {
              "ids": {
                "description": "Filter by chat ids",
                "example": [
                  "111111111@c.us"
                ],
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          }
        },
        "required": [
          "pagination",
          "filter"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ChatsController_deleteChat

**Metod & Yol:** `DELETE /api/{session}/chats/{chatId}`

**Açıqlama:** Deletes the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_deleteChat",
  "description": "Deletes the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_archiveChat

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/archive`

**Açıqlama:** Archive the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_archiveChat",
  "description": "Archive the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_clearMessages

**Metod & Yol:** `DELETE /api/{session}/chats/{chatId}/messages`

**Açıqlama:** Clears all messages from the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_clearMessages",
  "description": "Clears all messages from the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_getChatMessages

**Metod & Yol:** `GET /api/{session}/chats/{chatId}/messages`

**Açıqlama:** Gets messages in the chat

**Sorğu Parametrləri:**
- `sortBy` [query]: Sort by field
- `sortOrder` [query]: Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
- `downloadMedia` [query]: Download media for messages
- `limit` [query] (tələb olunur): 
- `offset` [query]: 
- `filter.timestamp.lte` [query]: Filter messages before this timestamp (inclusive)
- `filter.timestamp.gte` [query]: Filter messages after this timestamp (inclusive)
- `filter.fromMe` [query]: From me filter (by default shows all messages)
- `filter.ack` [query]: Filter messages by acknowledgment status
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Message ID",
        "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
      },
      "timestamp": {
        "type": "number",
        "description": "Unix timestamp for when the message was created",
        "example": 1666943582
      },
      "from": {
        "type": "string",
        "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
        "example": "11111111111@c.us"
      },
      "fromMe": {
        "type": "boolean",
        "description": "Indicates if the message was sent by the current user"
      },
      "source": {
        "enum": [
          "api",
          "app"
        ],
        "type": "string",
        "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
        "example": "api"
      },
      "to": {
        "type": "string",
        "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
        "example": "11111111111@c.us"
      },
      "participant": {
        "type": "string",
        "description": "For groups - participant who sent the message"
      },
      "body": {
        "type": "string",
        "description": "Message content"
      },
      "hasMedia": {
        "type": "boolean",
        "description": "Indicates if the message has media available for download"
      },
      "media": {
        "description": "Media object for the message if any and downloaded",
        "allOf": [
          {
            "type": "object",
            "properties": {
              "url": {
                "type": "string",
                "description": "The URL for the media in the message if any",
                "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
              },
              "mimetype": {
                "type": "string",
                "description": "mimetype for the media in the message if any",
                "example": "audio/jpeg"
              },
              "filename": {
                "type": "string",
                "description": "The original filename in mediaUrl in the message if any",
                "example": "example.pdf"
              },
              "s3": {
                "description": "S3 attributes for the media in the message if you are using S3 media storage",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "Bucket": {
                        "type": "string",
                        "description": "The name of the S3 bucket",
                        "example": "my-bucket"
                      },
                      "Key": {
                        "type": "string",
                        "description": "The key of the object in the S3 bucket",
                        "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                      }
                    },
                    "required": [
                      "Bucket",
                      "Key"
                    ]
                  }
                ]
              },
              "error": {
                "type": "object",
                "description": "Error message if there's an error downloading the media",
                "example": null
              }
            }
          }
        ]
      },
      "mediaUrl": {
        "type": "string",
        "description": "Use `media.url` instead! The URL for the media in the message if any",
        "deprecated": true,
        "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
      },
      "ack": {
        "enum": [
          -1,
          0,
          1,
          2,
          3,
          4
        ],
        "type": "number",
        "description": "ACK status for the message"
      },
      "ackName": {
        "type": "string",
        "description": "ACK status name for the message"
      },
      "author": {
        "type": "string",
        "description": "If the message was sent to a group, this field will contain the user that sent the message."
      },
      "location": {
        "description": "Location information contained in the message, if the message is type \"location\"",
        "allOf": [
          {
            "type": "object",
            "properties": {
              "latitude": {
                "type": "string"
              },
              "longitude": {
                "type": "string"
              },
              "live": {
                "type": "boolean"
              },
              "name": {
                "type": "string"
              },
              "address": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "thumbnail": {
                "type": "string"
              }
            },
            "required": [
              "latitude",
              "longitude",
              "live"
            ]
          }
        ]
      },
      "vCards": {
        "description": "List of vCards contained in the message.",
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "_data": {
        "type": "object",
        "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
      },
      "replyTo": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Message ID",
            "example": "AAAAAAAAAAAAAAAAAAAA"
          },
          "participant": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "body": {
            "type": "string",
            "example": "Hello!"
          },
          "_data": {
            "type": "object",
            "description": "Raw data from reply's message"
          }
        },
        "required": [
          "id"
        ]
      }
    },
    "required": [
      "id",
      "timestamp",
      "from",
      "fromMe",
      "source",
      "to",
      "participant",
      "body",
      "hasMedia",
      "mediaUrl",
      "ack",
      "ackName"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_getChatMessages",
  "description": "Gets messages in the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "sortBy": {
        "default": "timestamp",
        "enum": [
          "timestamp",
          "messageTimestamp"
        ],
        "type": "string",
        "description": "Location: query | Sort by field"
      },
      "sortOrder": {
        "enum": [
          "desc",
          "asc"
        ],
        "type": "string",
        "description": "Location: query | Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)"
      },
      "downloadMedia": {
        "default": true,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Download media for messages"
      },
      "limit": {
        "default": 10,
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      },
      "filter.timestamp.lte": {
        "type": "number",
        "description": "Location: query | Filter messages before this timestamp (inclusive)"
      },
      "filter.timestamp.gte": {
        "type": "number",
        "description": "Location: query | Filter messages after this timestamp (inclusive)"
      },
      "filter.fromMe": {
        "type": "boolean",
        "description": "Location: query | From me filter (by default shows all messages)"
      },
      "filter.ack": {
        "enum": [
          "ERROR",
          "PENDING",
          "SERVER",
          "DEVICE",
          "READ",
          "PLAYED"
        ],
        "type": "string",
        "description": "Location: query | Filter messages by acknowledgment status"
      },
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "limit",
      "session"
    ]
  }
}
```

## waha_ChatsController_readChatMessages

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/messages/read`

**Açıqlama:** Read unread messages in the chat

**Sorğu Parametrləri:**
- `messages` [query]: How much messages to read (latest first)
- `days` [query]: How much days to read (latest first)
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "description": "Messages IDs that have been read",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_readChatMessages",
  "description": "Read unread messages in the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "messages": {
        "example": 30,
        "type": "number",
        "description": "Location: query | How much messages to read (latest first)"
      },
      "days": {
        "default": 7,
        "type": "number",
        "description": "Location: query | How much days to read (latest first)"
      },
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_deleteMessage

**Metod & Yol:** `DELETE /api/{session}/chats/{chatId}/messages/{messageId}`

**Açıqlama:** Deletes a message from the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID
- `messageId` [path] (tələb olunur): Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_deleteMessage",
  "description": "Deletes a message from the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "messageId": {
        "example": "true_123456789@c.us_BAE6A33293978B16",
        "type": "string",
        "description": "Location: path | Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>"
      }
    },
    "required": [
      "chatId",
      "messageId",
      "session"
    ]
  }
}
```

## waha_ChatsController_getChatMessage

**Metod & Yol:** `GET /api/{session}/chats/{chatId}/messages/{messageId}`

**Açıqlama:** Gets message by id

**Sorğu Parametrləri:**
- `downloadMedia` [query]: Download media for messages
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID
- `messageId` [path] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Message ID",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "timestamp": {
      "type": "number",
      "description": "Unix timestamp for when the message was created",
      "example": 1666943582
    },
    "from": {
      "type": "string",
      "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
      "example": "11111111111@c.us"
    },
    "fromMe": {
      "type": "boolean",
      "description": "Indicates if the message was sent by the current user"
    },
    "source": {
      "enum": [
        "api",
        "app"
      ],
      "type": "string",
      "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
      "example": "api"
    },
    "to": {
      "type": "string",
      "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
      "example": "11111111111@c.us"
    },
    "participant": {
      "type": "string",
      "description": "For groups - participant who sent the message"
    },
    "body": {
      "type": "string",
      "description": "Message content"
    },
    "hasMedia": {
      "type": "boolean",
      "description": "Indicates if the message has media available for download"
    },
    "media": {
      "description": "Media object for the message if any and downloaded",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "The URL for the media in the message if any",
              "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
            },
            "mimetype": {
              "type": "string",
              "description": "mimetype for the media in the message if any",
              "example": "audio/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "The original filename in mediaUrl in the message if any",
              "example": "example.pdf"
            },
            "s3": {
              "description": "S3 attributes for the media in the message if you are using S3 media storage",
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "Bucket": {
                      "type": "string",
                      "description": "The name of the S3 bucket",
                      "example": "my-bucket"
                    },
                    "Key": {
                      "type": "string",
                      "description": "The key of the object in the S3 bucket",
                      "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                    }
                  },
                  "required": [
                    "Bucket",
                    "Key"
                  ]
                }
              ]
            },
            "error": {
              "type": "object",
              "description": "Error message if there's an error downloading the media",
              "example": null
            }
          }
        }
      ]
    },
    "mediaUrl": {
      "type": "string",
      "description": "Use `media.url` instead! The URL for the media in the message if any",
      "deprecated": true,
      "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
    },
    "ack": {
      "enum": [
        -1,
        0,
        1,
        2,
        3,
        4
      ],
      "type": "number",
      "description": "ACK status for the message"
    },
    "ackName": {
      "type": "string",
      "description": "ACK status name for the message"
    },
    "author": {
      "type": "string",
      "description": "If the message was sent to a group, this field will contain the user that sent the message."
    },
    "location": {
      "description": "Location information contained in the message, if the message is type \"location\"",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "latitude": {
              "type": "string"
            },
            "longitude": {
              "type": "string"
            },
            "live": {
              "type": "boolean"
            },
            "name": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            }
          },
          "required": [
            "latitude",
            "longitude",
            "live"
          ]
        }
      ]
    },
    "vCards": {
      "description": "List of vCards contained in the message.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "_data": {
      "type": "object",
      "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
    },
    "replyTo": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Message ID",
          "example": "AAAAAAAAAAAAAAAAAAAA"
        },
        "participant": {
          "type": "string",
          "example": "11111111111@c.us"
        },
        "body": {
          "type": "string",
          "example": "Hello!"
        },
        "_data": {
          "type": "object",
          "description": "Raw data from reply's message"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  "required": [
    "id",
    "timestamp",
    "from",
    "fromMe",
    "source",
    "to",
    "participant",
    "body",
    "hasMedia",
    "mediaUrl",
    "ack",
    "ackName"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_getChatMessage",
  "description": "Gets message by id",
  "parameters": {
    "type": "object",
    "properties": {
      "downloadMedia": {
        "default": true,
        "example": true,
        "type": "boolean",
        "description": "Location: query | Download media for messages"
      },
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "messageId": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "chatId",
      "messageId",
      "session"
    ]
  }
}
```

## waha_ChatsController_editMessage

**Metod & Yol:** `PUT /api/{session}/chats/{chatId}/messages/{messageId}`

**Açıqlama:** Edits a message in the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID
- `messageId` [path] (tələb olunur): Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "default": "Hello, world!"
    },
    "linkPreview": {
      "type": "boolean",
      "default": true
    },
    "linkPreviewHighQuality": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "text"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_editMessage",
  "description": "Edits a message in the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "messageId": {
        "example": "true_123456789@c.us_BAE6A33293978B16",
        "type": "string",
        "description": "Location: path | Message ID in format <code>{fromMe}_{chat}_{message_id}[_{participant}]</code>"
      },
      "body": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string",
            "default": "Hello, world!"
          },
          "linkPreview": {
            "type": "boolean",
            "default": true
          },
          "linkPreviewHighQuality": {
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "text"
        ]
      }
    },
    "required": [
      "body",
      "chatId",
      "messageId",
      "session"
    ]
  }
}
```

## waha_ChatsController_pinMessage

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/messages/{messageId}/pin`

**Açıqlama:** Pins a message in the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID
- `messageId` [path] (tələb olunur): 

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "duration": {
      "type": "number",
      "description": "Duration in seconds. 24 hours (86400), 7 days (604800), 30 days (2592000)",
      "example": 86400
    }
  },
  "required": [
    "duration"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_pinMessage",
  "description": "Pins a message in the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "messageId": {
        "type": "string",
        "description": "Location: path"
      },
      "body": {
        "type": "object",
        "properties": {
          "duration": {
            "type": "number",
            "description": "Duration in seconds. 24 hours (86400), 7 days (604800), 30 days (2592000)",
            "example": 86400
          }
        },
        "required": [
          "duration"
        ]
      }
    },
    "required": [
      "body",
      "chatId",
      "messageId",
      "session"
    ]
  }
}
```

## waha_ChatsController_unpinMessage

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/messages/{messageId}/unpin`

**Açıqlama:** Unpins a message in the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID
- `messageId` [path] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_unpinMessage",
  "description": "Unpins a message in the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "messageId": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "chatId",
      "messageId",
      "session"
    ]
  }
}
```

## waha_ChatsController_getChatPicture

**Metod & Yol:** `GET /api/{session}/chats/{chatId}/picture`

**Açıqlama:** Gets chat picture

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): 
- `refresh` [query]: Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string"
    }
  },
  "required": [
    "url"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_getChatPicture",
  "description": "Gets chat picture",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "type": "string",
        "description": "Location: path"
      },
      "refresh": {
        "default": false,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_unarchiveChat

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/unarchive`

**Açıqlama:** Unarchive the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_unarchiveChat",
  "description": "Unarchive the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ChatsController_unreadChat

**Metod & Yol:** `POST /api/{session}/chats/{chatId}/unread`

**Açıqlama:** Unread the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ChatsController_unreadChat",
  "description": "Unread the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ContactsSessionController_put

**Metod & Yol:** `PUT /api/{session}/contacts/{chatId}`

**Açıqlama:** Create or update contact

**Ətraflı:** Create or update contact on the phone address book. May not work if you have installed many WhatsApp apps on the same phone

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "default": "John",
      "description": "Contact First Name",
      "example": "John"
    },
    "lastName": {
      "type": "string",
      "default": "Doe",
      "description": "Contact Last Name",
      "example": "Doe"
    }
  },
  "required": [
    "firstName",
    "lastName"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ContactsSessionController_put",
  "description": "Create or update contact",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "default": "John",
            "description": "Contact First Name",
            "example": "John"
          },
          "lastName": {
            "type": "string",
            "default": "Doe",
            "description": "Contact Last Name",
            "example": "Doe"
          }
        },
        "required": [
          "firstName",
          "lastName"
        ]
      }
    },
    "required": [
      "body",
      "chatId",
      "session"
    ]
  }
}
```

## waha_EventsController_sendEvent

**Metod & Yol:** `POST /api/{session}/events`

**Açıqlama:** Send an event message

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "reply_to": {
      "type": "string",
      "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
      "example": null
    },
    "event": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Name of the event",
          "example": "John's Nail Appointment 💅"
        },
        "description": {
          "type": "string",
          "description": "Description of the event",
          "example": "It's time for your nail care session! 🌟\\n\\nYou'll be getting a *classic gel manicure* – clean, polished, and long-lasting. 💖\\n\\n📍 *Location:* Luxe Nail Studio\\nWe're on the *2nd floor of the Plaza Mall*, next to the flower shop. Look for the *pink neon sign*!\\n\\nFeel free to arrive *5–10 mins early* so we can get started on time 😊"
        },
        "startTime": {
          "type": "number",
          "description": "Start time of the event (Unix timestamp in seconds)",
          "example": 2063137000
        },
        "endTime": {
          "type": "number",
          "description": "End time of the event (Unix timestamp in seconds)",
          "example": null
        },
        "location": {
          "description": "Location of the event",
          "allOf": [
            {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Name of the location",
                  "example": "Luxe Nail Studio 💅"
                }
              },
              "required": [
                "name"
              ]
            }
          ]
        },
        "extraGuestsAllowed": {
          "type": "boolean",
          "description": "Whether extra guests are allowed",
          "example": false
        }
      },
      "required": [
        "name",
        "startTime"
      ]
    }
  },
  "required": [
    "chatId",
    "event"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Message ID",
      "example": "false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA"
    },
    "timestamp": {
      "type": "number",
      "description": "Unix timestamp for when the message was created",
      "example": 1666943582
    },
    "from": {
      "type": "string",
      "description": "ID for the Chat that this message was sent to, except if the message was sent by the current user ",
      "example": "11111111111@c.us"
    },
    "fromMe": {
      "type": "boolean",
      "description": "Indicates if the message was sent by the current user"
    },
    "source": {
      "enum": [
        "api",
        "app"
      ],
      "type": "string",
      "description": "The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only \"fromMe: true\" messages.",
      "example": "api"
    },
    "to": {
      "type": "string",
      "description": "\n* ID for who this message is for.\n* If the message is sent by the current user, it will be the Chat to which the message is being sent.\n* If the message is sent by another user, it will be the ID for the current user.\n",
      "example": "11111111111@c.us"
    },
    "participant": {
      "type": "string",
      "description": "For groups - participant who sent the message"
    },
    "body": {
      "type": "string",
      "description": "Message content"
    },
    "hasMedia": {
      "type": "boolean",
      "description": "Indicates if the message has media available for download"
    },
    "media": {
      "description": "Media object for the message if any and downloaded",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "url": {
              "type": "string",
              "description": "The URL for the media in the message if any",
              "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
            },
            "mimetype": {
              "type": "string",
              "description": "mimetype for the media in the message if any",
              "example": "audio/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "The original filename in mediaUrl in the message if any",
              "example": "example.pdf"
            },
            "s3": {
              "description": "S3 attributes for the media in the message if you are using S3 media storage",
              "allOf": [
                {
                  "type": "object",
                  "properties": {
                    "Bucket": {
                      "type": "string",
                      "description": "The name of the S3 bucket",
                      "example": "my-bucket"
                    },
                    "Key": {
                      "type": "string",
                      "description": "The key of the object in the S3 bucket",
                      "example": "default/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
                    }
                  },
                  "required": [
                    "Bucket",
                    "Key"
                  ]
                }
              ]
            },
            "error": {
              "type": "object",
              "description": "Error message if there's an error downloading the media",
              "example": null
            }
          }
        }
      ]
    },
    "mediaUrl": {
      "type": "string",
      "description": "Use `media.url` instead! The URL for the media in the message if any",
      "deprecated": true,
      "example": "http://localhost:3000/api/files/false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA.oga"
    },
    "ack": {
      "enum": [
        -1,
        0,
        1,
        2,
        3,
        4
      ],
      "type": "number",
      "description": "ACK status for the message"
    },
    "ackName": {
      "type": "string",
      "description": "ACK status name for the message"
    },
    "author": {
      "type": "string",
      "description": "If the message was sent to a group, this field will contain the user that sent the message."
    },
    "location": {
      "description": "Location information contained in the message, if the message is type \"location\"",
      "allOf": [
        {
          "type": "object",
          "properties": {
            "latitude": {
              "type": "string"
            },
            "longitude": {
              "type": "string"
            },
            "live": {
              "type": "boolean"
            },
            "name": {
              "type": "string"
            },
            "address": {
              "type": "string"
            },
            "url": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "thumbnail": {
              "type": "string"
            }
          },
          "required": [
            "latitude",
            "longitude",
            "live"
          ]
        }
      ]
    },
    "vCards": {
      "description": "List of vCards contained in the message.",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "_data": {
      "type": "object",
      "description": "Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend."
    },
    "replyTo": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "Message ID",
          "example": "AAAAAAAAAAAAAAAAAAAA"
        },
        "participant": {
          "type": "string",
          "example": "11111111111@c.us"
        },
        "body": {
          "type": "string",
          "example": "Hello!"
        },
        "_data": {
          "type": "object",
          "description": "Raw data from reply's message"
        }
      },
      "required": [
        "id"
      ]
    }
  },
  "required": [
    "id",
    "timestamp",
    "from",
    "fromMe",
    "source",
    "to",
    "participant",
    "body",
    "hasMedia",
    "mediaUrl",
    "ack",
    "ackName"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_EventsController_sendEvent",
  "description": "Send an event message",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "example": "11111111111@c.us"
          },
          "reply_to": {
            "type": "string",
            "description": "The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA",
            "example": null
          },
          "event": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string",
                "description": "Name of the event",
                "example": "John's Nail Appointment 💅"
              },
              "description": {
                "type": "string",
                "description": "Description of the event",
                "example": "It's time for your nail care session! 🌟\\n\\nYou'll be getting a *classic gel manicure* – clean, polished, and long-lasting. 💖\\n\\n📍 *Location:* Luxe Nail Studio\\nWe're on the *2nd floor of the Plaza Mall*, next to the flower shop. Look for the *pink neon sign*!\\n\\nFeel free to arrive *5–10 mins early* so we can get started on time 😊"
              },
              "startTime": {
                "type": "number",
                "description": "Start time of the event (Unix timestamp in seconds)",
                "example": 2063137000
              },
              "endTime": {
                "type": "number",
                "description": "End time of the event (Unix timestamp in seconds)",
                "example": null
              },
              "location": {
                "description": "Location of the event",
                "allOf": [
                  {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Name of the location",
                        "example": "Luxe Nail Studio 💅"
                      }
                    },
                    "required": [
                      "name"
                    ]
                  }
                ]
              },
              "extraGuestsAllowed": {
                "type": "boolean",
                "description": "Whether extra guests are allowed",
                "example": false
              }
            },
            "required": [
              "name",
              "startTime"
            ]
          }
        },
        "required": [
          "chatId",
          "event"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_GroupsController_getGroups

**Metod & Yol:** `GET /api/{session}/groups`

**Açıqlama:** Get all groups.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `sortBy` [query]: Sort by field
- `sortOrder` [query]: Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)
- `limit` [query]: 
- `offset` [query]: 
- `exclude` [query]: Exclude fields

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getGroups",
  "description": "Get all groups.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "sortBy": {
        "enum": [
          "id",
          "subject"
        ],
        "type": "string",
        "description": "Location: query | Sort by field"
      },
      "sortOrder": {
        "enum": [
          "desc",
          "asc"
        ],
        "type": "string",
        "description": "Location: query | Sort order - <b>desc</b>ending (Z => A, New first) or <b>asc</b>ending (A => Z, Old first)"
      },
      "limit": {
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "type": "number",
        "description": "Location: query"
      },
      "exclude": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "",
            "participants"
          ]
        },
        "description": "Location: query | Exclude fields"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_GroupsController_createGroup

**Metod & Yol:** `POST /api/{session}/groups`

**Açıqlama:** Create a new group.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "123456789@c.us"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "name",
    "participants"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_createGroup",
  "description": "Create a new group.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "participants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "123456789@c.us"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "name",
          "participants"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_GroupsController_getGroupsCount

**Metod & Yol:** `GET /api/{session}/groups/count`

**Açıqlama:** Get the number of groups.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "count": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "count"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getGroupsCount",
  "description": "Get the number of groups.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_GroupsController_joinGroup

**Metod & Yol:** `POST /api/{session}/groups/join`

**Açıqlama:** Join group via code

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string",
      "description": "Group code (123) or url (https://chat.whatsapp.com/123)",
      "example": "https://chat.whatsapp.com/1234567890abcdef"
    }
  },
  "required": [
    "code"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Group ID",
      "example": "123@g.us"
    }
  },
  "required": [
    "id"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_joinGroup",
  "description": "Join group via code",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "code": {
            "type": "string",
            "description": "Group code (123) or url (https://chat.whatsapp.com/123)",
            "example": "https://chat.whatsapp.com/1234567890abcdef"
          }
        },
        "required": [
          "code"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_GroupsController_joinInfoGroup

**Metod & Yol:** `GET /api/{session}/groups/join-info`

**Açıqlama:** Get info about the group before joining.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `code` [query] (tələb olunur): Group code (123) or url (https://chat.whatsapp.com/123)

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_joinInfoGroup",
  "description": "Get info about the group before joining.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "code": {
        "example": "https://chat.whatsapp.com/1234567890abcdef",
        "type": "string",
        "description": "Location: query | Group code (123) or url (https://chat.whatsapp.com/123)"
      }
    },
    "required": [
      "code",
      "session"
    ]
  }
}
```

## waha_GroupsController_refreshGroups

**Metod & Yol:** `POST /api/{session}/groups/refresh`

**Açıqlama:** Refresh groups from the server.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_refreshGroups",
  "description": "Refresh groups from the server.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_GroupsController_deleteGroup

**Metod & Yol:** `DELETE /api/{session}/groups/{id}`

**Açıqlama:** Delete the group.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_deleteGroup",
  "description": "Delete the group.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getGroup

**Metod & Yol:** `GET /api/{session}/groups/{id}`

**Açıqlama:** Get the group.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getGroup",
  "description": "Get the group.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_demoteToAdmin

**Metod & Yol:** `POST /api/{session}/groups/{id}/admin/demote`

**Açıqlama:** Demotes participants to regular users.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "123456789@c.us"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "participants"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_demoteToAdmin",
  "description": "Demotes participants to regular users.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "participants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "123456789@c.us"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "participants"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_promoteToAdmin

**Metod & Yol:** `POST /api/{session}/groups/{id}/admin/promote`

**Açıqlama:** Promote participants to admin users.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "123456789@c.us"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "participants"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_promoteToAdmin",
  "description": "Promote participants to admin users.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "participants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "123456789@c.us"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "participants"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_setDescription

**Metod & Yol:** `PUT /api/{session}/groups/{id}/description`

**Açıqlama:** Updates the group description.

**Ətraflı:** Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "description": {
      "type": "string"
    }
  },
  "required": [
    "description"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_setDescription",
  "description": "Updates the group description.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string"
          }
        },
        "required": [
          "description"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getInviteCode

**Metod & Yol:** `GET /api/{session}/groups/{id}/invite-code`

**Açıqlama:** Gets the invite code for the group.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**200 Cavab Sxemi:**
```json
{
  "type": "string"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getInviteCode",
  "description": "Gets the invite code for the group.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_revokeInviteCode

**Metod & Yol:** `POST /api/{session}/groups/{id}/invite-code/revoke`

**Açıqlama:** Invalidates the current group invite code and generates a new one.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**200 Cavab Sxemi:**
```json
{
  "type": "string"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_revokeInviteCode",
  "description": "Invalidates the current group invite code and generates a new one.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_leaveGroup

**Metod & Yol:** `POST /api/{session}/groups/{id}/leave`

**Açıqlama:** Leave the group.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_leaveGroup",
  "description": "Leave the group.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getParticipants

**Metod & Yol:** `GET /api/{session}/groups/{id}/participants`

**Açıqlama:** Get participants

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getParticipants",
  "description": "Get participants",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_addParticipants

**Metod & Yol:** `POST /api/{session}/groups/{id}/participants/add`

**Açıqlama:** Add participants

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "123456789@c.us"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "participants"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_addParticipants",
  "description": "Add participants",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "participants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "123456789@c.us"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "participants"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_removeParticipants

**Metod & Yol:** `POST /api/{session}/groups/{id}/participants/remove`

**Açıqlama:** Remove participants

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "participants": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "123456789@c.us"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "participants"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_removeParticipants",
  "description": "Remove participants",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "participants": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "123456789@c.us"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "participants"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getGroupParticipants

**Metod & Yol:** `GET /api/{session}/groups/{id}/participants/v2`

**Açıqlama:** Get group participants.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Member ID in @c.us or @lid format",
        "example": "123456789@lid"
      },
      "pn": {
        "type": "string",
        "description": "Member ID in @c.us format",
        "example": "123456789@c.us"
      },
      "role": {
        "enum": [
          "left",
          "participant",
          "admin",
          "superadmin"
        ],
        "type": "string",
        "example": "participant"
      }
    },
    "required": [
      "id",
      "role"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getGroupParticipants",
  "description": "Get group participants.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_deletePicture

**Metod & Yol:** `DELETE /api/{session}/groups/{id}/picture`

**Açıqlama:** Delete group picture

**Sorğu Parametrləri:**
- `id` [path] (tələb olunur): Group ID
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_deletePicture",
  "description": "Delete group picture",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getChatPicture

**Metod & Yol:** `GET /api/{session}/groups/{id}/picture`

**Açıqlama:** Get group picture

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID
- `refresh` [query]: Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string"
    }
  },
  "required": [
    "url"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getChatPicture",
  "description": "Get group picture",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "refresh": {
        "default": false,
        "example": false,
        "type": "boolean",
        "description": "Location: query | Refresh the picture from the server (24h cache by default). Do not refresh if not needed, you can get rate limit error"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_setPicture

**Metod & Yol:** `PUT /api/{session}/groups/{id}/picture`

**Açıqlama:** Set group picture

**Sorğu Parametrləri:**
- `id` [path] (tələb olunur): Group ID
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    }
  },
  "required": [
    "file"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_setPicture",
  "description": "Set group picture",
  "parameters": {
    "type": "object",
    "properties": {
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          }
        },
        "required": [
          "file"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getInfoAdminOnly

**Metod & Yol:** `GET /api/{session}/groups/{id}/settings/security/info-admin-only`

**Açıqlama:** Get the group's 'info admin only' settings.

**Ətraflı:** You can allow only admins to edit group info (title, description, photo).

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "adminsOnly": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "adminsOnly"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getInfoAdminOnly",
  "description": "Get the group's 'info admin only' settings.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_setInfoAdminOnly

**Metod & Yol:** `PUT /api/{session}/groups/{id}/settings/security/info-admin-only`

**Açıqlama:** Updates the group "info admin only" settings.

**Ətraflı:** You can allow only admins to edit group info (title, description, photo).

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "adminsOnly": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "adminsOnly"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_setInfoAdminOnly",
  "description": "Updates the group \"info admin only\" settings.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "adminsOnly": {
            "type": "boolean",
            "default": true
          }
        },
        "required": [
          "adminsOnly"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_getMessagesAdminOnly

**Metod & Yol:** `GET /api/{session}/groups/{id}/settings/security/messages-admin-only`

**Açıqlama:** Get settings - who can send messages

**Ətraflı:** The group settings to only allow admins to send messages.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "adminsOnly": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "adminsOnly"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_getMessagesAdminOnly",
  "description": "Get settings - who can send messages",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      }
    },
    "required": [
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_setMessagesAdminOnly

**Metod & Yol:** `PUT /api/{session}/groups/{id}/settings/security/messages-admin-only`

**Açıqlama:** Update settings - who can send messages

**Ətraflı:** Updates the group settings to only allow admins to send messages.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "adminsOnly": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "adminsOnly"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_setMessagesAdminOnly",
  "description": "Update settings - who can send messages",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "adminsOnly": {
            "type": "boolean",
            "default": true
          }
        },
        "required": [
          "adminsOnly"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_GroupsController_setSubject

**Metod & Yol:** `PUT /api/{session}/groups/{id}/subject`

**Açıqlama:** Updates the group subject

**Ətraflı:** Returns "true" if the subject was properly updated. This can return "false" if the user does not have the necessary permissions.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `id` [path] (tələb olunur): Group ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "subject": {
      "type": "string"
    }
  },
  "required": [
    "subject"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_GroupsController_setSubject",
  "description": "Updates the group subject",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "id": {
        "example": "123123123@g.us",
        "type": "string",
        "description": "Location: path | Group ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "subject": {
            "type": "string"
          }
        },
        "required": [
          "subject"
        ]
      }
    },
    "required": [
      "body",
      "id",
      "session"
    ]
  }
}
```

## waha_LabelsController_getAll

**Metod & Yol:** `GET /api/{session}/labels`

**Açıqlama:** Get all labels

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "1",
        "description": "Label ID"
      },
      "name": {
        "type": "string",
        "example": "Lead",
        "description": "Label name"
      },
      "color": {
        "type": "number",
        "example": 0,
        "description": "Color number, not hex"
      },
      "colorHex": {
        "type": "string",
        "example": "#ff9485",
        "description": "Color in hex"
      }
    },
    "required": [
      "id",
      "name",
      "color",
      "colorHex"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_getAll",
  "description": "Get all labels",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_LabelsController_create

**Metod & Yol:** `POST /api/{session}/labels`

**Açıqlama:** Create a new label

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "Lead",
      "description": "Label name"
    },
    "colorHex": {
      "type": "string",
      "example": "#ff9485",
      "description": "Color in hex"
    },
    "color": {
      "type": "number",
      "example": null,
      "description": "Color number, not hex"
    }
  },
  "required": [
    "name"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "1",
      "description": "Label ID"
    },
    "name": {
      "type": "string",
      "example": "Lead",
      "description": "Label name"
    },
    "color": {
      "type": "number",
      "example": 0,
      "description": "Color number, not hex"
    },
    "colorHex": {
      "type": "string",
      "example": "#ff9485",
      "description": "Color in hex"
    }
  },
  "required": [
    "id",
    "name",
    "color",
    "colorHex"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_create",
  "description": "Create a new label",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Lead",
            "description": "Label name"
          },
          "colorHex": {
            "type": "string",
            "example": "#ff9485",
            "description": "Color in hex"
          },
          "color": {
            "type": "number",
            "example": null,
            "description": "Color number, not hex"
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_LabelsController_getChatLabels

**Metod & Yol:** `GET /api/{session}/labels/chats/{chatId}`

**Açıqlama:** Get labels for the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "example": "1",
        "description": "Label ID"
      },
      "name": {
        "type": "string",
        "example": "Lead",
        "description": "Label name"
      },
      "color": {
        "type": "number",
        "example": 0,
        "description": "Color number, not hex"
      },
      "colorHex": {
        "type": "string",
        "example": "#ff9485",
        "description": "Color in hex"
      }
    },
    "required": [
      "id",
      "name",
      "color",
      "colorHex"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_getChatLabels",
  "description": "Get labels for the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_LabelsController_putChatLabels

**Metod & Yol:** `PUT /api/{session}/labels/chats/{chatId}`

**Açıqlama:** Save labels for the chat

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "labels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "example": "1",
            "description": "Label ID"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  },
  "required": [
    "labels"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_putChatLabels",
  "description": "Save labels for the chat",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      },
      "body": {
        "type": "object",
        "properties": {
          "labels": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "1",
                  "description": "Label ID"
                }
              },
              "required": [
                "id"
              ]
            }
          }
        },
        "required": [
          "labels"
        ]
      }
    },
    "required": [
      "body",
      "chatId",
      "session"
    ]
  }
}
```

## waha_LabelsController_delete

**Metod & Yol:** `DELETE /api/{session}/labels/{labelId}`

**Açıqlama:** Delete a label

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `labelId` [path] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object"
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_delete",
  "description": "Delete a label",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "labelId": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "labelId",
      "session"
    ]
  }
}
```

## waha_LabelsController_update

**Metod & Yol:** `PUT /api/{session}/labels/{labelId}`

**Açıqlama:** Update a label

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `labelId` [path] (tələb olunur): 

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "Lead",
      "description": "Label name"
    },
    "colorHex": {
      "type": "string",
      "example": "#ff9485",
      "description": "Color in hex"
    },
    "color": {
      "type": "number",
      "example": null,
      "description": "Color number, not hex"
    }
  },
  "required": [
    "name"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "1",
      "description": "Label ID"
    },
    "name": {
      "type": "string",
      "example": "Lead",
      "description": "Label name"
    },
    "color": {
      "type": "number",
      "example": 0,
      "description": "Color number, not hex"
    },
    "colorHex": {
      "type": "string",
      "example": "#ff9485",
      "description": "Color in hex"
    }
  },
  "required": [
    "id",
    "name",
    "color",
    "colorHex"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_update",
  "description": "Update a label",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "labelId": {
        "type": "string",
        "description": "Location: path"
      },
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "Lead",
            "description": "Label name"
          },
          "colorHex": {
            "type": "string",
            "example": "#ff9485",
            "description": "Color in hex"
          },
          "color": {
            "type": "number",
            "example": null,
            "description": "Color number, not hex"
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body",
      "labelId",
      "session"
    ]
  }
}
```

## waha_LabelsController_getChatsByLabel

**Metod & Yol:** `GET /api/{session}/labels/{labelId}/chats`

**Açıqlama:** Get chats by label

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `labelId` [path] (tələb olunur): 

**OpenAI Function JSON:**
```json
{
  "name": "waha_LabelsController_getChatsByLabel",
  "description": "Get chats by label",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "labelId": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "labelId",
      "session"
    ]
  }
}
```

## waha_LidsController_getAll

**Metod & Yol:** `GET /api/{session}/lids`

**Açıqlama:** Get all known lids to phone number mapping

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `limit` [query]: 
- `offset` [query]: 

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "lid": {
        "type": "string",
        "description": "Linked ID for the user",
        "example": "1111111@lid"
      },
      "pn": {
        "type": "string",
        "description": "Phone number (chat id) for the user",
        "example": "3333333@c.us"
      }
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LidsController_getAll",
  "description": "Get all known lids to phone number mapping",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "limit": {
        "default": 100,
        "type": "number",
        "description": "Location: query"
      },
      "offset": {
        "default": 0,
        "type": "number",
        "description": "Location: query"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_LidsController_getLidsCount

**Metod & Yol:** `GET /api/{session}/lids/count`

**Açıqlama:** Get the number of known lids

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "count": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "count"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LidsController_getLidsCount",
  "description": "Get the number of known lids",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_LidsController_findLIDByPhoneNumber

**Metod & Yol:** `GET /api/{session}/lids/pn/{phoneNumber}`

**Açıqlama:** Get lid by phone number (chat id)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `phoneNumber` [path] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "lid": {
      "type": "string",
      "description": "Linked ID for the user",
      "example": "1111111@lid"
    },
    "pn": {
      "type": "string",
      "description": "Phone number (chat id) for the user",
      "example": "3333333@c.us"
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LidsController_findLIDByPhoneNumber",
  "description": "Get lid by phone number (chat id)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "phoneNumber": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "phoneNumber",
      "session"
    ]
  }
}
```

## waha_LidsController_findPNByLid

**Metod & Yol:** `GET /api/{session}/lids/{lid}`

**Açıqlama:** Get phone number by lid

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `lid` [path] (tələb olunur): 

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "lid": {
      "type": "string",
      "description": "Linked ID for the user",
      "example": "1111111@lid"
    },
    "pn": {
      "type": "string",
      "description": "Phone number (chat id) for the user",
      "example": "3333333@c.us"
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_LidsController_findPNByLid",
  "description": "Get phone number by lid",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "lid": {
        "type": "string",
        "description": "Location: path"
      }
    },
    "required": [
      "lid",
      "session"
    ]
  }
}
```

## waha_MediaController_convertVideo

**Metod & Yol:** `POST /api/{session}/media/convert/video`

**Açıqlama:** Convert video to WhatsApp format (mp4)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "The URL for the video file",
      "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
    },
    "data": {
      "type": "string",
      "description": "Base64 content of the file",
      "example": null
    }
  }
}
```
**200 Cavab Sxemi:**
```json
{
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "mimetype": {
          "type": "string"
        },
        "data": {
          "type": "string"
        }
      },
      "required": [
        "mimetype",
        "data"
      ]
    }
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_MediaController_convertVideo",
  "description": "Convert video to WhatsApp format (mp4)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "The URL for the video file",
            "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
          },
          "data": {
            "type": "string",
            "description": "Base64 content of the file",
            "example": null
          }
        }
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_MediaController_convertVoice

**Metod & Yol:** `POST /api/{session}/media/convert/voice`

**Açıqlama:** Convert voice to WhatsApp format (opus)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "description": "The URL for the voice file",
      "example": "https://github.com/devlikeapro/waha/raw/core/examples/voice.mp3"
    },
    "data": {
      "type": "string",
      "description": "Base64 content of the file",
      "example": null
    }
  }
}
```
**200 Cavab Sxemi:**
```json
{
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "mimetype": {
          "type": "string"
        },
        "data": {
          "type": "string"
        }
      },
      "required": [
        "mimetype",
        "data"
      ]
    }
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_MediaController_convertVoice",
  "description": "Convert voice to WhatsApp format (opus)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "The URL for the voice file",
            "example": "https://github.com/devlikeapro/waha/raw/core/examples/voice.mp3"
          },
          "data": {
            "type": "string",
            "description": "Base64 content of the file",
            "example": null
          }
        }
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_PresenceController_getPresenceAll

**Metod & Yol:** `GET /api/{session}/presence`

**Açıqlama:** Get all subscribed presence information.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Chat ID - either group id or contact id",
        "example": "11111111111@c.us"
      },
      "presences": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "participant": {
              "type": "string",
              "description": "Chat ID - participant or contact id",
              "example": "11111111111@c.us"
            },
            "lastSeen": {
              "type": "number",
              "example": 1686568773
            },
            "lastKnownPresence": {
              "type": "string",
              "enum": [
                "offline",
                "online",
                "typing",
                "recording",
                "paused"
              ]
            }
          },
          "required": [
            "participant",
            "lastKnownPresence"
          ]
        }
      }
    },
    "required": [
      "id",
      "presences"
    ]
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_PresenceController_getPresenceAll",
  "description": "Get all subscribed presence information.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_PresenceController_setPresence

**Metod & Yol:** `POST /api/{session}/presence`

**Açıqlama:** Set session presence

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "chatId": {
      "type": "string",
      "description": "Chat ID - either group id or contact id",
      "example": "11111111111@c.us"
    },
    "presence": {
      "type": "string",
      "enum": [
        "offline",
        "online",
        "typing",
        "recording",
        "paused"
      ]
    }
  },
  "required": [
    "chatId",
    "presence"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_PresenceController_setPresence",
  "description": "Set session presence",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "chatId": {
            "type": "string",
            "description": "Chat ID - either group id or contact id",
            "example": "11111111111@c.us"
          },
          "presence": {
            "type": "string",
            "enum": [
              "offline",
              "online",
              "typing",
              "recording",
              "paused"
            ]
          }
        },
        "required": [
          "chatId",
          "presence"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_PresenceController_getPresence

**Metod & Yol:** `GET /api/{session}/presence/{chatId}`

**Açıqlama:** Get the presence for the chat id. If it hasn't been subscribed - it also subscribes to it.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Chat ID - either group id or contact id",
      "example": "11111111111@c.us"
    },
    "presences": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "participant": {
            "type": "string",
            "description": "Chat ID - participant or contact id",
            "example": "11111111111@c.us"
          },
          "lastSeen": {
            "type": "number",
            "example": 1686568773
          },
          "lastKnownPresence": {
            "type": "string",
            "enum": [
              "offline",
              "online",
              "typing",
              "recording",
              "paused"
            ]
          }
        },
        "required": [
          "participant",
          "lastKnownPresence"
        ]
      }
    }
  },
  "required": [
    "id",
    "presences"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_PresenceController_getPresence",
  "description": "Get the presence for the chat id. If it hasn't been subscribed - it also subscribes to it.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_PresenceController_subscribe

**Metod & Yol:** `POST /api/{session}/presence/{chatId}/subscribe`

**Açıqlama:** Subscribe to presence events for the chat.

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name
- `chatId` [path] (tələb olunur): Chat ID

**OpenAI Function JSON:**
```json
{
  "name": "waha_PresenceController_subscribe",
  "description": "Subscribe to presence events for the chat.",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "chatId": {
        "example": "123456789@c.us",
        "type": "string",
        "description": "Location: path | Chat ID"
      }
    },
    "required": [
      "chatId",
      "session"
    ]
  }
}
```

## waha_ProfileController_getMyProfile

**Metod & Yol:** `GET /api/{session}/profile`

**Açıqlama:** Get my profile

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "11111111111@c.us"
    },
    "picture": {
      "type": "string",
      "nullable": true,
      "example": "https://example.com/picture.jpg"
    },
    "name": {
      "type": "string"
    }
  },
  "required": [
    "id",
    "picture",
    "name"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ProfileController_getMyProfile",
  "description": "Get my profile",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ProfileController_setProfileName

**Metod & Yol:** `PUT /api/{session}/profile/name`

**Açıqlama:** Set my profile name

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "My New Name"
    }
  },
  "required": [
    "name"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ProfileController_setProfileName",
  "description": "Set my profile name",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "example": "My New Name"
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ProfileController_deleteProfilePicture

**Metod & Yol:** `DELETE /api/{session}/profile/picture`

**Açıqlama:** Delete profile picture

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ProfileController_deleteProfilePicture",
  "description": "Delete profile picture",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_ProfileController_setProfilePicture

**Metod & Yol:** `PUT /api/{session}/profile/picture`

**Açıqlama:** Set profile picture

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    }
  },
  "required": [
    "file"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ProfileController_setProfilePicture",
  "description": "Set profile picture",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          }
        },
        "required": [
          "file"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_ProfileController_setProfileStatus

**Metod & Yol:** `PUT /api/{session}/profile/status`

**Açıqlama:** Set profile status (About)

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "example": "🎉 Hey there! I am using WhatsApp 🎉"
    }
  },
  "required": [
    "status"
  ]
}
```
**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "success"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_ProfileController_setProfileStatus",
  "description": "Set profile status (About)",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "example": "🎉 Hey there! I am using WhatsApp 🎉"
          }
        },
        "required": [
          "status"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_StatusController_deleteStatus

**Metod & Yol:** `POST /api/{session}/status/delete`

**Açıqlama:** DELETE sent status

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Status message id to delete",
      "example": "AAAAAAAAAAAAAAAAA",
      "default": null
    },
    "contacts": {
      "description": "Contact list to send the status to.",
      "example": null,
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_deleteStatus",
  "description": "DELETE sent status",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Status message id to delete",
            "example": "AAAAAAAAAAAAAAAAA",
            "default": null
          },
          "contacts": {
            "description": "Contact list to send the status to.",
            "example": null,
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_StatusController_sendImageStatus

**Metod & Yol:** `POST /api/{session}/status/image`

**Açıqlama:** Send image status

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Pre-generated status message id",
      "example": "BBBBBBBBBBBBBBBBB",
      "default": null
    },
    "contacts": {
      "description": "Contact list to send the status to.",
      "example": null,
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Value can be null",
              "example": "filename.jpg"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "string",
              "description": "MIME type of the attachment.",
              "example": "image/jpeg"
            },
            "filename": {
              "type": "string",
              "description": "Document file name. Optional",
              "example": "filename.jpeg"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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"
            }
          },
          "required": [
            "mimetype",
            "data"
          ]
        }
      ]
    },
    "caption": {
      "type": "string"
    }
  },
  "required": [
    "file"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_sendImageStatus",
  "description": "Send image status",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Pre-generated status message id",
            "example": "BBBBBBBBBBBBBBBBB",
            "default": null
          },
          "contacts": {
            "description": "Contact list to send the status to.",
            "example": null,
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Value can be null",
                    "example": "filename.jpg"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/waha.jpg"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "string",
                    "description": "MIME type of the attachment.",
                    "example": "image/jpeg"
                  },
                  "filename": {
                    "type": "string",
                    "description": "Document file name. Optional",
                    "example": "filename.jpeg"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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"
                  }
                },
                "required": [
                  "mimetype",
                  "data"
                ]
              }
            ]
          },
          "caption": {
            "type": "string"
          }
        },
        "required": [
          "file"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_StatusController_getNewMessageId

**Metod & Yol:** `GET /api/{session}/status/new-message-id`

**Açıqlama:** Generate message ID you can use to batch contacts

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Pre-generated message id",
      "example": "BBBBBBBBBBBBBBBBB"
    }
  },
  "required": [
    "id"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_getNewMessageId",
  "description": "Generate message ID you can use to batch contacts",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      }
    },
    "required": [
      "session"
    ]
  }
}
```

## waha_StatusController_sendTextStatus

**Metod & Yol:** `POST /api/{session}/status/text`

**Açıqlama:** Send text status

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Pre-generated status message id",
      "example": "BBBBBBBBBBBBBBBBB",
      "default": null
    },
    "contacts": {
      "description": "Contact list to send the status to.",
      "example": null,
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "text": {
      "type": "string",
      "default": "Have a look! https://github.com/"
    },
    "backgroundColor": {
      "type": "string",
      "default": "#38b42f"
    },
    "font": {
      "type": "number",
      "default": 0
    },
    "linkPreview": {
      "type": "boolean",
      "default": true
    },
    "linkPreviewHighQuality": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "text",
    "backgroundColor",
    "font"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_sendTextStatus",
  "description": "Send text status",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Pre-generated status message id",
            "example": "BBBBBBBBBBBBBBBBB",
            "default": null
          },
          "contacts": {
            "description": "Contact list to send the status to.",
            "example": null,
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "text": {
            "type": "string",
            "default": "Have a look! https://github.com/"
          },
          "backgroundColor": {
            "type": "string",
            "default": "#38b42f"
          },
          "font": {
            "type": "number",
            "default": 0
          },
          "linkPreview": {
            "type": "boolean",
            "default": true
          },
          "linkPreviewHighQuality": {
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "text",
          "backgroundColor",
          "font"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_StatusController_sendVideoStatus

**Metod & Yol:** `POST /api/{session}/status/video`

**Açıqlama:** Send video status

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Pre-generated status message id",
      "example": "BBBBBBBBBBBBBBBBB",
      "default": null
    },
    "contacts": {
      "description": "Contact list to send the status to.",
      "example": null,
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "video/mp4",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "video.mp4",
              "description": "Document file name. Optional"
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
            }
          },
          "required": [
            "mimetype",
            "filename",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "video/mp4",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "video.mp4",
              "description": "Document file name. Optional"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHYhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAciEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAgAaq3yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq7yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq/yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAjIetKI9/zIAAAAwAAAwAAAwAAAwAVW8H+swAAAwAAAwAAEvcAAAAgAatHyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAgAatLyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAhAatPyJf/AAADAAADAAADAAADAByn5+AAAAMAAAMABN2QAAAAIiHtiiNf5EAAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMCgiAAAAAhAavXyLf/AAADAAADAAADAAADAAADAAADAAADAAADAO6YAAAAIQGr28i3/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwDumAAAACEBq9/It/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMA7pgAAAAiIe/aIt+HAAADAAADAAADAAADAAADAAADAAADAAADAAmagAAAACEBrGfIl/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMBF3AAAAAhAaxryJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfSEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkAAAAhAaxvyJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwAAAAIQGsc8iX/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwEXcAAAAAEKIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI="
            }
          },
          "required": [
            "mimetype",
            "filename",
            "data"
          ]
        }
      ]
    },
    "convert": {
      "type": "boolean",
      "description": "Convert the input file to the required format using ffmpeg before sending",
      "example": true
    },
    "caption": {
      "type": "string"
    }
  },
  "required": [
    "file",
    "convert"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_sendVideoStatus",
  "description": "Send video status",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Pre-generated status message id",
            "example": "BBBBBBBBBBBBBBBBB",
            "default": null
          },
          "contacts": {
            "description": "Contact list to send the status to.",
            "example": null,
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "video/mp4",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "video.mp4",
                    "description": "Document file name. Optional"
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/video.mp4"
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "video/mp4",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "video.mp4",
                    "description": "Document file name. Optional"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH0hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHYhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAciEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAgAaq3yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq7yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAgAaq/yd8AAAMAAAMAAAMAAAMAHrvIgAAAAwAAAwAFtJAAAAAjIetKI9/zIAAAAwAAAwAAAwAAAwAVW8H+swAAAwAAAwAAEvcAAAAgAatHyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAgAatLyV8AAAMAAAMAAAMAAAMAKY8KAAADAAADAAAIOyAAAAAhAatPyJf/AAADAAADAAADAAADAByn5+AAAAMAAAMABN2QAAAAIiHtiiNf5EAAAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMCgiAAAAAhAavXyLf/AAADAAADAAADAAADAAADAAADAAADAAADAO6YAAAAIQGr28i3/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwDumAAAACEBq9/It/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMA7pgAAAAiIe/aIt+HAAADAAADAAADAAADAAADAAADAAADAAADAAmagAAAACEBrGfIl/8AAAMAAAMAAAMAAAMAAAMAAAMAAAMAAAMBF3AAAAAhAaxryJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB2IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4hEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfSEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcyEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwhEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3p4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHohEAUAoBv/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3pwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeCEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADengAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfiEQBQCgG//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADenAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHkAAAAhAaxvyJf/AAADAAADAAADAAADAAADAAADAAADAAADARdwAAAAIQGsc8iX/wAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwEXcAAAAAEKIRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6IRAFAKAb/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN6cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHI="
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "data"
                ]
              }
            ]
          },
          "convert": {
            "type": "boolean",
            "description": "Convert the input file to the required format using ffmpeg before sending",
            "example": true
          },
          "caption": {
            "type": "string"
          }
        },
        "required": [
          "file",
          "convert"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_StatusController_sendVoiceStatus

**Metod & Yol:** `POST /api/{session}/status/voice`

**Açıqlama:** Send voice status

**Sorğu Parametrləri:**
- `session` [path] (tələb olunur): Session name

**Request Body (JSON):**
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Pre-generated status message id",
      "example": "BBBBBBBBBBBBBBBBB",
      "default": null
    },
    "contacts": {
      "description": "Contact list to send the status to.",
      "example": null,
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "file": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "audio/ogg; codecs=opus",
              "description": "MIME type of the attachment."
            },
            "url": {
              "type": "string",
              "example": "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus"
            }
          },
          "required": [
            "mimetype",
            "url"
          ]
        },
        {
          "type": "object",
          "properties": {
            "mimetype": {
              "type": "object",
              "default": "audio/ogg; codecs=opus",
              "description": "MIME type of the attachment."
            },
            "filename": {
              "type": "object",
              "default": "voice-message.mp3",
              "description": "Document file name. Optional"
            },
            "data": {
              "type": "string",
              "description": "Base64-encoded data of the file",
              "example": "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VSO3pMrPlDI7//NkxP8g454UCuJGUWisGIZWQwUgpHZyhg4kNUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxP4ibDnMAOGEzFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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"
            }
          },
          "required": [
            "mimetype",
            "filename",
            "data"
          ]
        }
      ]
    },
    "convert": {
      "type": "boolean",
      "description": "Convert the input file to the required format using ffmpeg before sending",
      "example": true
    },
    "backgroundColor": {
      "type": "string",
      "default": "#38b42f"
    }
  },
  "required": [
    "file",
    "convert",
    "backgroundColor"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_StatusController_sendVoiceStatus",
  "description": "Send voice status",
  "parameters": {
    "type": "object",
    "properties": {
      "session": {
        "default": "default",
        "description": "Location: path | Session name"
      },
      "body": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Pre-generated status message id",
            "example": "BBBBBBBBBBBBBBBBB",
            "default": null
          },
          "contacts": {
            "description": "Contact list to send the status to.",
            "example": null,
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "file": {
            "oneOf": [
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "audio/ogg; codecs=opus",
                    "description": "MIME type of the attachment."
                  },
                  "url": {
                    "type": "string",
                    "example": "https://github.com/devlikeapro/waha/raw/core/examples/dev.likeapro.opus"
                  }
                },
                "required": [
                  "mimetype",
                  "url"
                ]
              },
              {
                "type": "object",
                "properties": {
                  "mimetype": {
                    "type": "object",
                    "default": "audio/ogg; codecs=opus",
                    "description": "MIME type of the attachment."
                  },
                  "filename": {
                    "type": "object",
                    "default": "voice-message.mp3",
                    "description": "Document file name. Optional"
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64-encoded data of the file",
                    "example": "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VSO3pMrPlDI7//NkxP8g454UCuJGUWisGIZWQwUgpHZyhg4kNUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxP4ibDnMAOGEzFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NkxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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"
                  }
                },
                "required": [
                  "mimetype",
                  "filename",
                  "data"
                ]
              }
            ]
          },
          "convert": {
            "type": "boolean",
            "description": "Convert the input file to the required format using ffmpeg before sending",
            "example": true
          },
          "backgroundColor": {
            "type": "string",
            "default": "#38b42f"
          }
        },
        "required": [
          "file",
          "convert",
          "backgroundColor"
        ]
      }
    },
    "required": [
      "body",
      "session"
    ]
  }
}
```

## waha_HealthController_check

**Metod & Yol:** `GET /health`

**Açıqlama:** Check the health of the server

**Ətraflı:** Perform all health checks and return the server's health status.

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "example": "ok"
    },
    "info": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "error": {
      "type": "object",
      "example": {},
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "details": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      }
    }
  }
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_HealthController_check",
  "description": "Check the health of the server",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```

## waha_PingController_ping

**Metod & Yol:** `GET /ping`

**Açıqlama:** Ping the server

**Ətraflı:** Check if the server is alive and responding to requests.

**200 Cavab Sxemi:**
```json
{
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "default": "pong"
    }
  },
  "required": [
    "message"
  ]
}
```
**OpenAI Function JSON:**
```json
{
  "name": "waha_PingController_ping",
  "description": "Ping the server",
  "parameters": {
    "type": "object",
    "properties": {}
  }
}
```
