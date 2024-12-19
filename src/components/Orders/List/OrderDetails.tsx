export function OrderDetails({ order, showSellerInfo = false }: OrderDetailsProps) {
  return (
    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {showSellerInfo && (
          <div>
            <dt className="text-xs font-medium text-gray-500">Seller</dt>
            <dd className="mt-1 text-sm text-gray-900 break-words">{order.seller_name}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900 break-words">{order.customer_email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Product</dt>
          <dd className="mt-1 text-sm text-gray-900 break-words">
            {order.product_name} (x{order.quantity})
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Amount</dt>
          <dd className="mt-1 text-sm text-gray-900 break-words">
            ${order.total_amount.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-gray-500">Date</dt>
          <dd className="mt-1 text-sm text-gray-900 break-words">
            {new Date(order.created_at).toLocaleDateString()}
          </dd>
        </div>
      </div>
    </div>
  );
}