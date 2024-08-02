import Script from "next/script";

export function GoogleAnalytics() {
  const isProductionEnvironment = process.env.NODE_ENV === "production";
  if (!isProductionEnvironment) return <></>;

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG}`}
      />

      <Script id="" strategy="lazyOnload">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_TAG}');
          `}
      </Script>
    </>
  );
}
