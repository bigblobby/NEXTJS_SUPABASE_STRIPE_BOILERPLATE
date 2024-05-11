import { Drawer, DrawerContent } from "@/lib/components/ui/drawer"
import { Dialog, DialogContent } from '@/lib/components/ui/dialog';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';

interface CheckoutDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  stripePromise: any;
  options: any;
}

export default function CheckoutDrawerModal({
  open,
  setOpen,
  stripePromise,
  options,
}: CheckoutDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={(open) => setOpen(open)}>
      <DrawerContent>
        <div className="py-6">
          {options && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={options}
            >
              <EmbeddedCheckout className="bg-background" />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <div id="checkout">
          {options && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={options}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}