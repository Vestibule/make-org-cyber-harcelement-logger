package com.github.chagall.notificationlistenerexample

import android.content.Intent
import android.net.Uri
import java.net.URI

import android.os.Bundle
import android.os.Parcelable
import android.util.Base64
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import okio.BufferedSink
import okio.ByteString.Companion.readByteString
import okio.Okio
import okio.Source
import okio.source
import java.io.File
import java.io.InputStream

class ShareFileActivity : AppCompatActivity() {
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        // Get intent, action and MIME type
        super.onCreate(savedInstanceState)
        val intent = intent
        val action = intent.action
        val type = intent.type
        if (Intent.ACTION_SEND == action && type != null) {
            if ("text/plain" == type) {
                handleSendText(intent) // Handle text being sent
            } else if (type.startsWith("image/")) {
                handleSendImage(intent) // Handle single image being sent
            }
        } else if (Intent.ACTION_SEND_MULTIPLE == action && type != null) {
            if (type.startsWith("image/")) {
            }
        } else {
            // Handle other intents, such as being started from the home screen
        }
    }

    fun handleSendText(intent: Intent) {
        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
        if (sharedText != null) {
            // Update UI to reflect text being shared
        }
    }

    fun handleSendImage(intent: Intent) {
        val imageUri = intent.getParcelableExtra<Parcelable>(Intent.EXTRA_STREAM) as Uri?
        if (imageUri != null) {
            // Update UI to reflect image being shared
            Log.i("NCC - path", imageUri.path.toString())
            val inputStream = contentResolver.openInputStream(imageUri)!!
            // val file = File(imageUri.path!!);
            Log.i("NCC - size", inputStream.available().toString())

            val formBody = MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("screenshot", "test.png", body=inputStream.asRequestBody("image/png".toMediaTypeOrNull()))
                .build() // body=file.asRequestBody("image/png".toMediaTypeOrNull())).build()

            Log.i("NCC - body", formBody.parts.toString())
            Log.i("NCC - body", formBody.size.toString())

            val request = Request.Builder()
                .url("http://ec2-35-180-193-101.eu-west-3.compute.amazonaws.com:3000/message/screenshot")
                .addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuYmF6Iiwic3ViIjo2LCJpYXQiOjE2MzQ0NTg4MjYsImV4cCI6MTY2NTk5NDgyNn0.8ZEnhCy25dkYNCG-F0Ag0HRXjEfTaRZle8vBcY_5afk")
                .post(formBody)
                .build()

            try {
                Thread {
                    val response = client.newCall(request).execute();
                    Log.i("NCC", "${response.code}: ${response.message}")
                }.start()
            } catch (e: Exception) {
                Log.e("NCC", e.toString(), e)
            }
        }
    }
}


fun InputStream.asRequestBody(contentType: MediaType? = null): RequestBody {
    val fileContent = this.readBytes();
    val encodedFileContent = Base64.encodeToString(fileContent, Base64.DEFAULT);
    return object : RequestBody() {
        override fun contentType() = contentType

        override fun contentLength() = encodedFileContent.length.toLong()

        override fun writeTo(sink: BufferedSink) {
            sink.write(encodedFileContent.toByteArray());
        }
    }
}