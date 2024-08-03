import Script from "next/script";

export function Ads() {
  return (
    <>
      <Script
        src="https://richinfo.co/richpartners/push/js/rp-cl-ob.js?pubid=934194&siteid=349270&niche=33"
        async
        data-cfasync="false"
        strategy="beforeInteractive"
      />
    </>
  );
}
