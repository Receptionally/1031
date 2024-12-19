@@ .. @@
       <div className="sm:col-span-2">
         <div className="relative flex items-start">
           <div className="flex items-center h-5">
             <input
               type="checkbox"
               id="providesStacking"
               name="providesStacking"
               checked={formState.providesStacking}
               onChange={handleCheckboxChange}
               className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
             />
           </div>
           <div className="ml-3 text-sm">
             <label htmlFor="providesStacking" className="font-medium text-gray-700">
               Provide Stacking Service
             </label>
             <p className="text-gray-500">Check this if you offer firewood stacking services</p>
           </div>
         </div>
       </div>

       {formState.providesStacking && (
-        <div className="sm:col-span-2">
+        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div>
             <label htmlFor="stackingFeePerUnit" className="block text-sm font-medium text-gray-700">
               Stacking Fee (per {formState.firewoodUnit || 'unit'})
             </label>
             <div className="mt-1 relative rounded-md shadow-sm">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <span className="text-gray-500 sm:text-sm">$</span>
               </div>
               <input
                 type="number"
                 id="stackingFeePerUnit"
                 name="stackingFeePerUnit"
                 min="0"
                 step="0.01"
                 value={formState.stackingFeePerUnit}
                 onChange={onChange}
                 required={formState.providesStacking}
                 className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
               />
             </div>
           </div>
+          <div>
+            <label htmlFor="maxStackingDistance" className="block text-sm font-medium text-gray-700">
+              Maximum Stacking Distance (feet)
+            </label>
+            <div className="mt-1">
+              <input
+                type="number"
+                id="maxStackingDistance"
+                name="maxStackingDistance"
+                min="1"
+                value={formState.maxStackingDistance}
+                onChange={onChange}
+                required={formState.providesStacking}
+                className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
+                placeholder="Distance from truck to stacking location"
+              />
+            </div>
+          </div>
         </div>
       )}