@@ .. @@
       if (setupError) throw setupError;
       
       const setupIntentId = sessionStorage.getItem('setup_intent_id');
-      sessionStorage.removeItem('setup_intent_id');
 
       // Update seller status
       const { error: updateError } = await supabase
@@ .. @@
       logger.info('Successfully set up subscription payment method');
+      // Store success message in session storage
+      sessionStorage.setItem('subscription_success', 'true');
+      sessionStorage.removeItem('setup_intent_id');
+      
+      // Redirect to seller dashboard
+      navigate('/seller-dashboard');
       onSuccess();
-      
-      // Store success message in session storage
-      sessionStorage.setItem('subscription_success', 'true');
-      
-      // Redirect to seller dashboard
-      navigate('/seller-dashboard');