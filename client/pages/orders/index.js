const OrderIndex = ({ orders }) => {
  // const OrderIndex = ({ order }) => {
  return (
    <ul>
      {orders.map(odrer => {
        return (
          <li key={odrer.id}>
            {odrer.ticket.title} - {odrer.status}
          </li>
        )
      })}
    </ul>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')

  return { orders: data }
}

export default OrderIndex
