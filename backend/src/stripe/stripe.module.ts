import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import Stripe from 'stripe';

@Module({
  providers: [
    StripeService,
    {
      provide: "STRIPE_CLIENT",
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
          apiVersion: "2025-02-24.acacia"
        })
      }
    }
  ],
  controllers: [StripeController],
  exports: ["STRIPE_CLIENT", StripeService]
})
export class StripeModule {}
