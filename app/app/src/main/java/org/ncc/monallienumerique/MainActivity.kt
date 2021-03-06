package org.ncc.monallienumerique

import android.app.AlertDialog
import android.content.*
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private var interceptedNotificationImageView: ImageView? = null
    private var interceptedNotificationTextView: TextView? = null
    private var forwardedNotificationTextView: TextView? = null
    private var imageChangeBroadcastReceiver: ImageChangeBroadcastReceiver? = null
    private var enableNotificationListenerAlertDialog: AlertDialog? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Here we get a reference to the image we will modify when a notification is received
        interceptedNotificationImageView = findViewById<View>(R.id.intercepted_notification_logo) as ImageView
        interceptedNotificationTextView = findViewById<View>(R.id.intercepted_notification_data) as TextView
        forwardedNotificationTextView = findViewById<View>(R.id.forwarded_notification_text) as TextView

        // If the user did not turn the notification listener service on we prompt him to do so
        if (!isNotificationServiceEnabled) {
            enableNotificationListenerAlertDialog = buildNotificationServiceAlertDialog()
            enableNotificationListenerAlertDialog!!.show()
        }

        // Finally we register a receiver to tell the MainActivity when a notification has been received
        imageChangeBroadcastReceiver = ImageChangeBroadcastReceiver()
        val intentFilter = IntentFilter()
        intentFilter.addAction("org.ncc.monallienumerique")
        registerReceiver(imageChangeBroadcastReceiver, intentFilter)
    }

    override fun onDestroy() {
        super.onDestroy()
        unregisterReceiver(imageChangeBroadcastReceiver)
    }

    /**
     * @param jsonData The intercepted notification data as a JSON string
     */
    private fun changeInterceptedNotificationDetails(jsonData: String?, packageName: String?, forwarded: Boolean) {
        interceptedNotificationTextView!!.text = jsonData ?: "No data extracted"

        val associatedImage = logosByPackageName[packageName] ?: R.drawable.other_notification_logo
        interceptedNotificationImageView!!.setImageResource(associatedImage)

        forwardedNotificationTextView!!.text = if (forwarded) "Sent to backend" else "Not sent"
    }

    /**
     * Is Notification Service Enabled.
     * Verifies if the notification listener service is enabled.
     * Got it from: https://github.com/kpbird/NotificationListenerService-Example/blob/master/NLSExample/src/main/java/com/kpbird/nlsexample/NLService.java
     * @return True if enabled, false otherwise.
     */
    private val isNotificationServiceEnabled: Boolean
        get() {
            val pkgName = packageName
            val flat = Settings.Secure.getString(contentResolver,
                    ENABLED_NOTIFICATION_LISTENERS)
            if (!TextUtils.isEmpty(flat)) {
                val names = flat.split(":").toTypedArray()
                for (i in names.indices) {
                    val cn = ComponentName.unflattenFromString(names[i])
                    if (cn != null) {
                        if (TextUtils.equals(pkgName, cn.packageName)) {
                            return true
                        }
                    }
                }
            }
            return false
        }

    /**
     * Image Change Broadcast Receiver.
     * We use this Broadcast Receiver to notify the Main Activity when
     * a new notification has arrived, so it can properly change the
     * notification image
     */
    inner class ImageChangeBroadcastReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val jsonData = intent.getStringExtra("notificationDetailsJson")
            val packageName = intent.getStringExtra("packageName")
            val forwarded = intent.getBooleanExtra("forwarded", false)
            changeInterceptedNotificationDetails(jsonData, packageName, forwarded)
        }
    }

    /**
     * Build Notification Listener Alert Dialog.
     * Builds the alert dialog that pops up if the user has not turned
     * the Notification Listener Service on yet.
     * @return An alert dialog which leads to the notification enabling screen
     */
    private fun buildNotificationServiceAlertDialog(): AlertDialog {
        val alertDialogBuilder = AlertDialog.Builder(this)
        alertDialogBuilder.setTitle(R.string.notification_listener_service)
        alertDialogBuilder.setMessage(R.string.notification_listener_service_explanation)
        alertDialogBuilder.setPositiveButton(R.string.yes
        ) { _, _ -> startActivity(Intent(ACTION_NOTIFICATION_LISTENER_SETTINGS)) }
        alertDialogBuilder.setNegativeButton(R.string.no
        ) { _, _ ->
            // If you choose to not enable the notification listener
            // the app. will not work as expected
        }
        return alertDialogBuilder.create()
    }

    companion object {
        private const val ENABLED_NOTIFICATION_LISTENERS = "enabled_notification_listeners"
        private const val ACTION_NOTIFICATION_LISTENER_SETTINGS = "android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"

        private val logosByPackageName = mapOf(
                "com.facebook.katana" to R.drawable.facebook_logo,
                "com.facebook.orca" to R.drawable.facebook_logo,
                "com.whatsapp" to R.drawable.whatsapp_logo,
                "com.instagram.android" to R.drawable.instagram_logo,
        )

    }
}