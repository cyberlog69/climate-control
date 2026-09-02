# ProGuard rules for ClimateSphere
-keepattributes *Annotation*
-keepclassmembers class * {
    @androidx.room.* <methods>;
}
