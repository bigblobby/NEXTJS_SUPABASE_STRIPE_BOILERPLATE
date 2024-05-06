import { Container } from '@/lib/components/ui/container';
import { Heading } from '@/lib/components/ui/heading';
import { Text } from '@/lib/components/ui/text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs"
import { Fingerprint, HardDrive, CircleDollarSign, Mail, Check } from 'lucide-react';
import Image from 'next/image';


export default function FeatureTabs() {
  return (
    <section>
      <Container size={10} className="py-20 lg:py-28">
        <Heading variant="tagline" className="text-center">TOOLS</Heading>
        <Heading className="text-center">Get off to a flying start, <br /> start building today, not tomorrow</Heading>
        <Text className="mt-3 max-w-lg text-center mx-auto" variant="leading">The all in one SaaS template, choose the right tools for you. Everything you need - ready to go.</Text>

        <div className="mt-8 max-w-3xl mx-auto">
          <Tabs defaultValue="authentication">
            <TabsList variant="underline" className="w-full flex-wrap">
              <TabsTrigger className="w-1/2 sm:w-1/4 p-5" value="authentication" variant="underline"><Fingerprint width={20} className="mr-2" />Authentication</TabsTrigger>
              <TabsTrigger className="w-1/2 sm:w-1/4 p-5" value="database" variant="underline"><HardDrive className="mr-2" />Database</TabsTrigger>
              <TabsTrigger className="w-1/2 sm:w-1/4 p-5" value="payments" variant="underline"><CircleDollarSign className="mr-2" />Payments</TabsTrigger>
              <TabsTrigger className="w-1/2 sm:w-1/4 p-5" value="email" variant="underline"><Mail className="mr-2" />Email</TabsTrigger>
            </TabsList>
            <TabsContent value="authentication">
              <div className="mt-5 sm:mt-0 sm:px-5 sm:py-8">
                <div className="flex flex-col gap-8 sm:flex-row items-center">
                  <div className="sm:w-1/2">
                    <Text className="text-center font-bold text-lg">Choose between:</Text>
                    <div className="flex flex-row justify-center items-center space-x-4 mt-2 sm:mt-5 text-center">
                      <span>
                        <Image className="dark:hidden" src="/assets/icons/supabase-logo-wordmark--light.svg" alt="Supabase icon" width={100} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/supabase-logo-wordmark--dark.svg" alt="Supabase icon" width={100} height={20} />
                      </span>
                      <span className="relative">
                        <Image className="dark:hidden" src="/assets/icons/firebase-logo-wordmark--light.svg" alt="Firebase icon" width={80} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/firebase-logo-wordmark--dark.svg" alt="Firebase icon" width={80} height={20} />
                        <Text className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm" variant="muted">Coming soon</Text>
                      </span>
                    </div>
                  </div>
                  <ul className="sm:w-1/2">
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Login and signup</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Magic links</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Google 0Auth</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Private/Protected pages</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="database">
              <div className="mt-5 sm:mt-0 sm:px-5 sm:py-8">
                <div className="flex flex-col gap-8 sm:flex-row items-center">
                  <div className="sm:w-1/2">
                    <Text className="text-center font-bold text-lg">Choose between:</Text>
                    <div className="flex flex-row justify-center items-center space-x-4 mt-2 sm:mt-5 text-center">
                      <span>
                        <Image className="dark:hidden" src="/assets/icons/supabase-logo-wordmark--light.svg" alt="Supabase icon" width={100} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/supabase-logo-wordmark--dark.svg" alt="Supabase icon" width={100} height={20} />
                      </span>
                      <span className="relative">
                        <Image className="dark:hidden" src="/assets/icons/firebase-logo-wordmark--light.svg" alt="Firebase icon" width={80} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/firebase-logo-wordmark--dark.svg" alt="Firebase icon" width={80} height={20} />
                        <Text className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm" variant="muted">Coming soon</Text>
                      </span>
                    </div>
                  </div>
                  <ul className="sm:w-1/2">
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Postgres/NoSQL</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Edge/Cloud functions</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Scalable</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Secure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payments">
              <div className="mt-5 sm:mt-0 sm:px-5 sm:py-8">
                <div className="flex flex-col gap-8 sm:flex-row items-center">
                  <div className="sm:w-1/2">
                    <Text className="text-center font-bold text-lg">Choose between:</Text>
                    <div className="flex flex-row justify-center items-center space-x-4 mt-2 sm:mt-5 text-center">
                      <span>
                        <Image className="dark:hidden" src="/assets/icons/stripe-wordmark-blurple.svg" alt="Stripe icon" width={80} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/stripe-wordmark-white.svg" alt="Stripe icon" width={80} height={20} />
                      </span>
                      <span className="relative">
                        <Image src="/assets/icons/lemon-squeezy-wordmark-purple.svg" alt="Lemon squeezy icon" width={120} height={20} />
                        <Text className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm" variant="muted">Coming soon</Text>
                      </span>
                    </div>
                  </div>
                  <ul className="sm:w-1/2">
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Easy payments</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Webhooks ready to go</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Payment processing or an all in one solution (with Lemon Squeezy)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="email">
              <div className="mt-5 sm:mt-0 sm:px-5 sm:py-8">
                <div className="flex flex-col gap-8 sm:flex-row items-center">
                  <div className="sm:w-1/2">
                    <Text className="text-center font-bold text-lg">Choose between:</Text>
                    <div className="flex flex-row justify-center items-center space-x-4 mt-2 sm:mt-5 text-center">
                      <span>
                        <Image className="dark:hidden" src="/assets/icons/resend-wordmark-black.svg" alt="Resend icon" width={80} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/resend-wordmark-white.svg" alt="Resend icon" width={80} height={20} />
                      </span>
                      <span className="relative">
                        <Image className="dark:hidden" src="/assets/icons/mailgun-wordmark--light.svg" alt="Mailgun icon" width={80} height={20} />
                        <Image className="hidden dark:block" src="/assets/icons/mailgun-wordmark--dark.svg" alt="Mailgun icon" width={80} height={20} />
                        <Text className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm" variant="muted">Coming soon</Text>
                      </span>
                    </div>
                  </div>
                  <ul className="sm:w-1/2">
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Minimal setup</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Mail list</span>
                    </li>
                    <li className="flex">
                      <span className="w-6 mr-3"><Check className="text-green-500" /></span>
                      <span>Forgot password, <br />user confirmation, <br />magic links etc</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  )
}