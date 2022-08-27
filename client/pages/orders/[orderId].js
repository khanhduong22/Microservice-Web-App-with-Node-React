import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import { useEffect, useState } from 'react'
import Router from 'next/router'

const orderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = (new Date(order.expiresAt) - new Date()) / 1_000
      setTimeLeft(Math.round(msLeft))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1_000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      <h1>{order.ticket.title}</h1>
      <h4>Price: {order.ticket.price}</h4>
      <hr />
      <h2>{timeLeft} seconds until order expires</h2>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51Lb4IlGru7xPM1DgRg6HVaXonZVR1cc4FgHRSWSgVOaKmU0OYMMVAZi7rsz37I2q70aPm00frGkzuYLSn10Ybu1B00my4wTEDa'
        amount={order.ticket.price * 1_00}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

orderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`api/orders/${orderId}`)
  return { order: data }
}

export default orderShow
