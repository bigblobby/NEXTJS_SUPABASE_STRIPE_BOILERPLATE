// import { initializePaddle, Paddle } from '@paddle/paddle-js';
//
// export function Checkout() {
//   // Create a local state to store Paddle instance
//   const [paddle, setPaddle] = useState<Paddle>();
//
//   // Download and initialize Paddle instance from CDN
//   useEffect(() => {
//     initializePaddle({ environment: 'ENVIRONMENT_GOES_HERE', token: 'AUTH_TOKEN_GOES_HERE' }).then(
//       (paddleInstance: Paddle | undefined) => {
//         if (paddleInstance) {
//           setPaddle(paddleInstance);
//         }
//       },
//     );
//   }, []);
//
//   // Callback to open a checkout
//   const openCheckout = () => {
//     paddle?.Checkout.open({
//       items: [{ priceId: 'PRICE_ID_GOES_HERE', quantity: 1 }],
//     });
//   };
// }