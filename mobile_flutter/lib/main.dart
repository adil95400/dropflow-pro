import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:dropflow_pro/src/app.dart';
import 'package:dropflow_pro/src/config/app_config.dart';
import 'package:dropflow_pro/src/services/notification_service.dart';
import 'package:dropflow_pro/src/services/analytics_service.dart';

void main() async {
  // Ensure Flutter is initialized
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  
  // Keep splash screen until initialization is complete
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  
  try {
    // Load environment variables
    await dotenv.load();
    
    // Initialize Supabase
    await Supabase.initialize(
      url: dotenv.env['SUPABASE_URL'] ?? '',
      anonKey: dotenv.env['SUPABASE_ANON_KEY'] ?? '',
      debug: AppConfig.isDevelopment,
    );
    
    // Initialize Stripe
    if (dotenv.env['STRIPE_PUBLISHABLE_KEY'] != null) {
      Stripe.publishableKey = dotenv.env['STRIPE_PUBLISHABLE_KEY']!;
      await Stripe.instance.applySettings();
    }
    
    // Initialize services
    await NotificationService.initialize();
    await AnalyticsService.initialize();
    
    // Set preferred orientations
    await SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    
    // Set system UI overlay style
    SystemChrome.setSystemUIOverlayStyle(
      SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Colors.white,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
    );
  } catch (e) {
    print('Initialization error: $e');
  } finally {
    // Remove splash screen
    FlutterNativeSplash.remove();
  }
  
  // Run the app
  runApp(
    ProviderScope(
      child: DropFlowApp(),
    ),
  );
}