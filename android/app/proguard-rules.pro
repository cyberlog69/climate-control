# ProGuard/R8 rules for ClimateSphere

# Keep annotations used by Room, Retrofit and kotlinx.serialization.
-keepattributes *Annotation*, InnerClasses, EnclosingMethod, Signature

# Room
-keep class * extends androidx.room.RoomDatabase { *; }
-keepclassmembers class * {
    @androidx.room.* <methods>;
}
-keep @androidx.room.Entity class * { *; }

# Retrofit: keep interface methods and generic signatures.
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# OkHttp / Okio
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# kotlinx.serialization: generated serializers are looked up reflectively.
-keepclassmembers class **$$serializer { *; }
-keepclasseswithmembers class * {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class com.climatesphere.app.**$$serializer { *; }
-keepclassmembers class com.climatesphere.app.** {
    *** Companion;
}
-keepclasseswithmembers class com.climatesphere.app.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# Keep Compose runtime metadata.
-dontwarn androidx.compose.**

# WorkManager workers are instantiated by name.
-keep class * extends androidx.work.ListenableWorker { *; }

# Keep line numbers so release crash reports remain useful.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
