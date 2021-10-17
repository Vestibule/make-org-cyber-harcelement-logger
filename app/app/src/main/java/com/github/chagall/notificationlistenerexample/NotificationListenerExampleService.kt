package com.github.chagall.notificationlistenerexample

import android.app.Notification
import android.content.Intent
import android.os.Build
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import androidx.annotation.RequiresApi
import android.util.Log
import androidx.annotation.WorkerThread
import androidx.core.app.NotificationCompat
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName
import okhttp3.Headers
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.internal.addHeaderLenient
import java.io.IOException
import java.util.*


val JSON = "application/json; charset=utf-8".toMediaType()


/**
 * MIT License
 *
 * Copyright (c) 2016 Fábio Alves Martins Pereira (Chagall)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
class NotificationListenerExampleService : NotificationListenerService() {
    private object ApplicationPackageNames {
        const val FACEBOOK_PACK_NAME = "com.facebook.katana"
        const val FACEBOOK_MESSENGER_PACK_NAME = "com.facebook.orca"
        const val WHATSAPP_PACK_NAME = "com.whatsapp"
        const val INSTAGRAM_PACK_NAME = "com.instagram.android"
        const val GOOGLE_CHAT_PACK_NAME = "com.google.android.apps.dynamite"
    }

    object InterceptedNotificationCode {
        const val FACEBOOK_CODE = 1
        const val WHATSAPP_CODE = 2
        const val INSTAGRAM_CODE = 3
        const val GOOGLE_CHAT_CODE = 4
        const val OTHER_NOTIFICATIONS_CODE = 5 // We ignore all notification with code == 4
    }

    private val client = OkHttpClient()

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val notificationCode = processNotification(sbn)

        val intent = Intent("com.github.chagall.notificationlistenerexample")
        intent.putExtra("Notification Code", notificationCode)
        sendBroadcast(intent)
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification) {
        val notificationCode = processNotification(sbn)

        val activeNotifications = this.activeNotifications
        if (activeNotifications != null && activeNotifications.isNotEmpty()) {
            for (i in activeNotifications.indices) {
                if (notificationCode == processNotification(activeNotifications[i])) {
                    val intent = Intent("com.github.chagall.notificationlistenerexample")
                    intent.putExtra("Notification Code", notificationCode)
                    sendBroadcast(intent)
                    break
                }
            }
        }
    }

    data class NotificationDetails(
            @SerializedName("app") val sourceApp: String,
            val title: String? = null,
            @SerializedName("body") val content: String? = null,
            @SerializedName("sender") val author: String? = null,
            @SerializedName("receivedAt") val receivedAt: Date = Calendar.getInstance().time
    ) {

        companion object {
            fun fromSbn(sbn: StatusBarNotification): NotificationDetails {
                val msgCompat = NotificationCompat.MessagingStyle.extractMessagingStyleFromNotification(sbn.notification);
                if (msgCompat != null) {
                    val messages = msgCompat.messages;
                    messages.removeAll(msgCompat.historicMessages);

                    return NotificationDetails(
                            sbn.packageName,
                            msgCompat.conversationTitle?.toString(),
                            msgCompat.messages.last()?.toString(),
                            msgCompat.user.name?.toString(),
                    )
                }

                return NotificationDetails(
                        sbn.packageName,
                        sbn.notification.extras.getCharSequence(Notification.EXTRA_TITLE)?.toString(),
                        sbn.notification.extras.getCharSequence(Notification.EXTRA_TEXT)?.toString(),
                        null
                )
            }
        }

        fun isEmpty() = title.isNullOrEmpty() || author.isNullOrEmpty();
        fun toRequestBody(): RequestBody {
            return Gson().toJson(this).toRequestBody(JSON)
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    private fun processNotification(sbn: StatusBarNotification): Int {
        val notificationDetails = NotificationDetails.fromSbn(sbn)
        Log.w("NCC", "Matched notification from $packageName: $notificationDetails")
        if (!notificationDetails.isEmpty()) {
            val bundle = sbn.notification.extras
            for (key in bundle.keySet()) {
                Log.d("NCC", key + " : " + if (bundle[key] != null) bundle[key] else "NULL")
            }
        }

        val appCode = when (notificationDetails.sourceApp) {
            ApplicationPackageNames.FACEBOOK_PACK_NAME ->
                InterceptedNotificationCode.FACEBOOK_CODE
            ApplicationPackageNames.FACEBOOK_MESSENGER_PACK_NAME ->
                InterceptedNotificationCode.FACEBOOK_CODE
            ApplicationPackageNames.INSTAGRAM_PACK_NAME ->
                InterceptedNotificationCode.INSTAGRAM_CODE
            ApplicationPackageNames.WHATSAPP_PACK_NAME ->
                InterceptedNotificationCode.WHATSAPP_CODE
            ApplicationPackageNames.GOOGLE_CHAT_PACK_NAME ->
                InterceptedNotificationCode.GOOGLE_CHAT_CODE
            else ->
                InterceptedNotificationCode.OTHER_NOTIFICATIONS_CODE

        }

        if (appCode != InterceptedNotificationCode.OTHER_NOTIFICATIONS_CODE &&
                !notificationDetails.isEmpty()) {
            pushContent(notificationDetails)
        }

        return appCode;
    }

    private val bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuYmF6Iiwic3ViIjo2LCJpYXQiOjE2MzQ0NTg4MjYsImV4cCI6MTY2NTk5NDgyNn0.8ZEnhCy25dkYNCG-F0Ag0HRXjEfTaRZle8vBcY_5afk"
    private val host = "ec2-user@ec2-35-180-193-101.eu-west-3.compute.amazonaws.com"
    private val port = 3000

    private fun pushContent(content: NotificationDetails) {
        val body = content.toRequestBody()
        val request = Request.Builder()
                .url("http://$host:$port/message")
                .addHeader("Authorization", "Bearer $bearerToken")
                .post(body)
                .build()
        try {
            Thread {
                val response = client.newCall(request).execute();
                Log.i("NCC", "${response.code}: ${response.message}")
            }.start()

        } catch (e: IOException) {
            Log.e("NCC", e.toString(), e)
        }
    }
}
