package org.ncc.monallienumerique

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Parcelable
import android.util.Base64
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
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

            val dictionary = Gson().toJson(mapOf("screenshot" to inputStream.asRequestBody("image/png".toMediaTypeOrNull())))
            val body = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), dictionary);
            val request = Request.Builder()
                .url("http://ec2-35-180-193-101.eu-west-3.compute.amazonaws.com:3000/message/screenshot")
                .addHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuYmF6Iiwic3ViIjo2LCJpYXQiOjE2MzQ0NTg4MjYsImV4cCI6MTY2NTk5NDgyNn0.8ZEnhCy25dkYNCG-F0Ag0HRXjEfTaRZle8vBcY_5afk")
                .addHeader("Content-Transfer-Encoding", "base64")
                .post(body)
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


fun InputStream.asRequestBody(contentType: MediaType? = null): String {
    val fileContent = this.readBytes();
    val encodedFileContent = Base64.encodeToString(fileContent, Base64.DEFAULT);
    Log.i("NCC - display file", encodedFileContent);
    return encodedFileContent

}