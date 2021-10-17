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
import com.google.gson.GsonBuilder
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


val JSON = "application/json; charset=utf-8".toMediaType()

class NotificationListenerExampleService : NotificationListenerService() {
    private val applicationPackageNamesAllowlist = listOf(
        "com.facebook.katana",
        "com.facebook.orca",
        "com.whatsapp",
        "com.instagram.android",
        "com.google.android.apps.dynamite",
    )

    // Server auth details expire by the end of the weekend.
    private val bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuYmF6Iiwic3ViIjo2LCJpYXQiOjE2MzQ0NTg4MjYsImV4cCI6MTY2NTk5NDgyNn0.8ZEnhCy25dkYNCG-F0Ag0HRXjEfTaRZle8vBcY_5afk"
    private val host = "ec2-user@ec2-35-180-193-101.eu-west-3.compute.amazonaws.com"
    private val port = 3000

    private val client = OkHttpClient()

    override fun onNotificationPosted(sbn: StatusBarNotification) = processNotification(sbn)

    private fun processNotification(sbn: StatusBarNotification) {
        val notificationDetails = NotificationDetails.fromSbn(sbn)
        Log.w("NCC", "Matched notification from $packageName: $notificationDetails")
        if (!notificationDetails.isEmpty()) {
            val bundle = sbn.notification.extras
            for (key in bundle.keySet()) {
                Log.d("NCC", key + " : " + if (bundle[key] != null) bundle[key] else "NULL")
            }
        }

        val shouldForward = !notificationDetails.isEmpty() && applicationPackageNamesAllowlist.contains(notificationDetails.sourceApp)
        if (shouldForward) {
            pushContent(notificationDetails)
        }

        val intent = Intent("com.github.chagall.notificationlistenerexample")
        intent.putExtra("notificationDetailsJson", notificationDetails.toJson(pretty = true))
        intent.putExtra("packageName", notificationDetails.sourceApp)
        intent.putExtra("forwarded", shouldForward)
        sendBroadcast(intent)
    }

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
                val message = msgCompat.messages.last();

                return NotificationDetails(
                        sbn.packageName,
                        msgCompat.conversationTitle?.toString(),
                        message?.text?.toString(),
                        message?.person?.name?.toString(),
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

    fun isEmpty() = title.isNullOrEmpty() || author.isNullOrEmpty()

    fun toJson(pretty: Boolean = false): String {
        val builder = GsonBuilder()
        if (pretty) builder.setPrettyPrinting()
        return builder.create().toJson(this)
    }

    fun toRequestBody() = toJson().toRequestBody(JSON)

}
