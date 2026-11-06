export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-b from-[#01718B] to-[#015A6E] text-white p-10 min-h-screen">
      <div>
        <div className="bg-white rounded-lg px-3 py-2 inline-flex mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nice/logo.png"
            alt="NICE – Network of Insurance & Claims Expert"
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)" }} className="text-3xl leading-tight mb-3">
          Insurance made simple.
        </h1>
        <p className="text-white/80 text-sm leading-relaxed max-w-md">
          NICE – Network of Insurance &amp; Claims Expert is a general insurance services provider with more than
          13 years of industry experience. We bring technology and a human touch together to help you choose the
          right cover.
        </p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/nice/banner.png"
        alt="NICE insurance services"
        className="w-full rounded-xl object-cover my-8 border border-white/20"
      />

      <div className="text-[12px] leading-relaxed text-white/80">
        <div className="text-white font-medium mb-1">NICE – Network of Insurance &amp; Claims Expert</div>
        <div>H No-C 108, Ground Floor, Opposite Life Worth Hospital, Amapara, Raipur, Chhattisgarh 492001</div>
        <a href="tel:+919771420518" className="block hover:text-white transition-colors mt-1">
          +91 97714 20518
        </a>
        <a href="tel:+918210437434" className="block hover:text-white transition-colors">
          +91 82104 37434
        </a>
        <a href="mailto:rajeev@niceinsurance.co.in" className="block hover:text-white transition-colors">
          rajeev@niceinsurance.co.in
        </a>
      </div>
    </div>
  );
}
