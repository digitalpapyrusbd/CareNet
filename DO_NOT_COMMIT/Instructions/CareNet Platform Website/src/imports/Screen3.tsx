import svgPaths from "./svg-xoc645uu0j";
import imgImage40 from "figma:asset/6f414a1708eab67cd18926ef903ba3ae4ea6eb67.png";

function ListBullet() {
  return (
    <div className="absolute left-[6px] size-[38px] top-[6px]" data-name="List Bullet">
      <div className="absolute flex items-center justify-center right-[18.5px] top-[19px] translate-x-[50%] translate-y-[-50%]">
        <div className="flex-none rotate-[180deg]">
          <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative text-[20px] text-[rgba(235,235,245,0.6)] text-center text-nowrap tracking-[0.38px]">
            <p className="leading-[24px] whitespace-pre">􀆇</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftArrowICon() {
  return (
    <div className="relative shrink-0 size-[50px]" data-name="Left Arrow iCon">
      <div className="absolute left-0 size-[50px] top-0">
        <div className="absolute inset-[-28%_-48%_-52%_-32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 90 90">
            <g filter="url(#filter0_d_3_830)" id="Ellipse 811">
              <circle cx="41" cy="39" fill="url(#paint0_linear_3_830)" r="25" />
              <circle cx="41" cy="39" r="24.5" stroke="var(--stroke-0, #282B2E)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="90" id="filter0_d_3_830" width="90" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="4" dy="6" />
                <feGaussianBlur stdDeviation="10" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_830" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_830" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_830" x1="57.25" x2="26" y1="57.75" y2="19.625">
                <stop stopColor="#141515" />
                <stop offset="1" stopColor="#2E3236" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <ListBullet />
    </div>
  );
}

function Frame16() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative shrink-0 w-full">
      <div className="flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white tracking-[0.38px]">
        <p className="leading-[24px] whitespace-pre">Nearby Superchargers</p>
      </div>
      <LeftArrowICon />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Montreal, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">4 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame2 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 3">
      <Frame1 />
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame5 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 2">
      <Frame4 />
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame8 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 4">
      <Frame7 />
      <Frame9 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame11 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 5">
      <Frame10 />
      <Frame12 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center leading-[0] not-italic relative shrink-0 tracking-[-0.078px] w-[160px]">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] w-full">
        <p className="leading-[18px]">{`Tesla Supercharger -Mascouche, QC `}</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center relative shrink-0 text-[0px] text-white w-full">
        <p className="leading-[18px] not-italic text-[13px] tracking-[-0.078px]">
          2<span className="text-[rgba(235,235,245,0.6)]">{` / `}</span>
          <span className="text-[rgba(235,235,245,0.3)]">2 available</span>
        </p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative shrink-0 size-[34px]">
      <div className="absolute h-[34px] left-[6.48px] top-0 w-[21.04px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 34">
          <path d={svgPaths.p219c2600} fill="url(#paint0_linear_3_845)" id="Vector 13" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_845" x1="10.5201" x2="10.5201" y1="0" y2="34">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[17.5px] not-italic text-[13px] text-black text-center text-nowrap top-[12px] tracking-[-0.078px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[18px] whitespace-pre">􀋦</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative shrink-0 w-[40px]">
      <Frame14 />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-center tracking-[-0.078px] w-[40px]">
        <p className="leading-[18px]">1.7 Km</p>
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[20px] relative rounded-[50px] shrink-0 w-full" data-name="Row 6">
      <Frame13 />
      <Frame15 />
    </div>
  );
}

function ModeDescription() {
  return (
    <div className="absolute box-border content-stretch flex flex-col items-center justify-center left-1/2 px-[30px] py-[20px] rounded-[40px] top-[4px] translate-x-[-50%] w-[338px]" data-name="Mode Description">
      <Frame16 />
      <Row1 />
      <Row />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function DropdownTableRow() {
  return (
    <div className="absolute bg-[#202122] h-[314px] left-1/2 overflow-x-clip overflow-y-auto rounded-[40px] top-[498px] translate-x-[-50%] w-[330px]" data-name="Dropdown Table Row">
      <ModeDescription />
      <div className="absolute inset-0 pointer-events-none shadow-[-6px_-6px_12px_0px_inset_rgba(255,255,255,0.25),6px_6px_12px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function Tesla24X241X() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="tesla(24x24)@1x 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="tesla(24x24)@1x 1">
          <path d={svgPaths.p36922700} id="Vector" stroke="url(#paint0_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M17 15H7L6 17H18L17 15Z" id="Vector_2" stroke="url(#paint1_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M2 9H4L6 12H18L20 9H22" id="Vector_3" stroke="url(#paint2_linear_3_832)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_832" x1="12" x2="12" y1="5" y2="19">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_832" x1="12" x2="12" y1="15" y2="17">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_3_832" x1="12" x2="12" y1="9" y2="12">
            <stop stopColor="#2FB8FF" />
            <stop offset="1" stopColor="#9EECD9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center relative shrink-0">
      <Tesla24X241X />
    </div>
  );
}

function ChargeScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Charge Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Display:Semibold',sans-serif] inset-0 justify-center leading-[0] not-italic text-[20px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.38px]">
        <p className="leading-[24px]">􀋦</p>
      </div>
    </div>
  );
}

function Hide() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Hide">
      <div className="absolute left-[-0.5px] size-[44px] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Ellipse 803"></g>
        </svg>
      </div>
    </div>
  );
}

function LocationScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Location Screen">
      <div className="absolute bottom-0 flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] left-[-0.5px] not-italic right-[0.5px] text-[22px] text-[rgba(235,235,245,0.6)] text-center top-0 tracking-[0.0324px]">
        <p className="leading-[normal]">􀋒</p>
      </div>
    </div>
  );
}

function ProfilScreen() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Profil Screen">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',sans-serif] inset-0 justify-center leading-[0] not-italic text-[22px] text-[rgba(235,235,245,0.6)] text-center tracking-[0.0324px]">
        <p className="leading-[normal]">􀉪</p>
      </div>
    </div>
  );
}

function TabBarMenu() {
  return (
    <div className="absolute bottom-[17px] content-stretch flex items-center justify-between left-[22px] right-[22px]" data-name="Tab Bar Menu">
      <Frame />
      <ChargeScreen />
      <Hide />
      <LocationScreen />
      <ProfilScreen />
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute bottom-0 h-[78px] left-0 right-0" data-name="Tab bar">
      <div className="absolute bottom-0 h-[78px] left-0 right-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 78">
          <g data-figma-bg-blur-radius="40" filter="url(#filter0_i_3_847)" id="Rectangle 41">
            <path d={svgPaths.pd7fc480} fill="var(--fill-0, white)" fillOpacity="0.44" style={{ mixBlendMode: "overlay" }} />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158" id="filter0_i_3_847" width="470" x="-40" y="-40">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="1.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.22 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_847" />
            </filter>
            <clipPath id="bgblur_0_3_847_clip_path" transform="translate(40 40)">
              <path d={svgPaths.pd7fc480} />
            </clipPath>
          </defs>
        </svg>
      </div>
      <TabBarMenu />
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="absolute bottom-[62px] left-1/2 size-[68px] translate-x-[-50%]" data-name="Plus icon">
      <div className="absolute left-1/2 size-[68px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 68 68">
          <g data-figma-bg-blur-radius="20" id="Ellipse 808">
            <circle cx="34" cy="34" fill="var(--fill-0, white)" fillOpacity="0.31" r="34" style={{ mixBlendMode: "overlay" }} />
            <circle cx="34" cy="34" r="33.5" stroke="url(#paint0_linear_3_810)" strokeOpacity="0.42" />
          </g>
          <defs>
            <clipPath id="bgblur_0_3_810_clip_path" transform="translate(20 20)">
              <circle cx="34" cy="34" r="34" />
            </clipPath>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_810" x1="34" x2="34" y1="0" y2="68">
              <stop stopColor="white" stopOpacity="0.6" />
              <stop offset="1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bg-clip-text bg-gradient-to-b flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] from-[#2fb8ff] justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[36px] text-center text-nowrap to-[#9eecd9] top-[calc(50%+0.5px)] tracking-[0.0232px] translate-x-[-50%] translate-y-[-50%]" style={{ WebkitTextFillColor: "transparent" }}>
        <p className="leading-[normal] whitespace-pre">􀅼</p>
      </div>
    </div>
  );
}

function TabBar1() {
  return (
    <div className="absolute bottom-[-2px] h-[130px] left-[-2px] right-[-2px]" data-name="Tab bar">
      <div className="absolute bottom-[15px] left-[91px] size-[40px]" data-name="Neon Light Effect">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <path d={svgPaths.p38d3e400} fill="url(#paint0_linear_3_816)" id="Neon Light Effect" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_816" x1="20" x2="20" y1="0" y2="40">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <TabBar />
      <PlusIcon />
    </div>
  );
}

function BatteryBase() {
  return (
    <div className="absolute h-[39px] left-0 top-[73px] w-[274px]" data-name="Battery Base">
      <div className="absolute inset-[-1.28%_-2.19%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 286 40">
          <g id="Battery Base">
            <g data-figma-bg-blur-radius="20" filter="url(#filter0_i_3_839)" id="Vector 14">
              <path d={svgPaths.p29947180} fill="var(--fill-0, white)" fillOpacity="0.2" style={{ mixBlendMode: "overlay" }} />
              <path d={svgPaths.p29947180} stroke="url(#paint0_linear_3_839)" style={{ mixBlendMode: "overlay" }} />
            </g>
            <g filter="url(#filter1_f_3_839)" id="Rectangle 36">
              <path d="M6 23.5H280V28.5H6V23.5Z" fill="var(--fill-0, black)" fillOpacity="0.17" style={{ mixBlendMode: "overlay" }} />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="80" id="filter0_i_3_839" width="313.988" x="-13.488" y="-20">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="11" dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.29 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_839" />
            </filter>
            <clipPath id="bgblur_0_3_839_clip_path" transform="translate(13.488 20)">
              <path d={svgPaths.p29947180} />
            </clipPath>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="17" id="filter1_f_3_839" width="286" x="0" y="17.5">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_839" stdDeviation="3" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_839" x1="143.5" x2="143.5" y1="0.5" y2="39.5">
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function BatteryCharge() {
  return (
    <div className="absolute h-[39px] left-[0.5px] top-[73px] w-[153.5px]" data-name="Battery Charge">
      <div className="absolute inset-[-20.51%_-5.21%_-20.51%_-4.89%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 169 55">
          <g id="Battery Charge">
            <g filter="url(#filter0_i_3_822)" id="Vector 15">
              <path d={svgPaths.pc284500} fill="url(#paint0_linear_3_822)" />
            </g>
            <g filter="url(#filter1_if_3_822)" id="Vector 19">
              <path d={svgPaths.pc284500} fill="url(#paint1_linear_3_822)" />
            </g>
            <mask height="39" id="mask0_3_822" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="154" x="7" y="8">
              <path d={svgPaths.p3ce3c600} fill="url(#paint2_linear_3_822)" id="Vector 18" />
            </mask>
            <g mask="url(#mask0_3_822)">
              <g filter="url(#filter2_f_3_822)" id="Rectangle 35">
                <rect fill="var(--fill-0, black)" fillOpacity="0.04" height="5" style={{ mixBlendMode: "overlay" }} width="292" y="31" />
              </g>
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44" id="filter0_i_3_822" width="153" x="8" y="8">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_822" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="55" id="filter1_if_3_822" width="169" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="5" />
              <feGaussianBlur stdDeviation="4.5" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
              <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3_822" />
              <feGaussianBlur result="effect2_foregroundBlur_3_822" stdDeviation="4" />
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="13" id="filter2_f_3_822" width="300" x="-4" y="27">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_822" stdDeviation="2" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_822" x1="84.5" x2="84.5" y1="8" y2="47">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_822" x1="84.5" x2="84.5" y1="8" y2="47">
              <stop stopColor="#2FB8FF" />
              <stop offset="1" stopColor="#9EECD9" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_3_822" x1="144.5" x2="144.5" y1="8" y2="47">
              <stop stopColor="#76AA6E" />
              <stop offset="0.346154" stopColor="#204A25" />
              <stop offset="0.628205" stopColor="#1E4B20" />
              <stop offset="1" stopColor="#3B8527" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function NeonEffect() {
  return (
    <div className="absolute h-[97px] left-px top-0 w-[153px]" data-name="Neon Effect">
      <div className="absolute bottom-0 left-[-3.92%] right-[-3.27%] top-[-14.43%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 164 111">
          <g id="Neon Effect">
            <path d={svgPaths.p33f12b00} fill="url(#paint0_linear_3_818)" fillOpacity="0.2" id="Rectangle 43" />
            <g filter="url(#filter0_f_3_818)" id="Rectangle 45">
              <path d="M14 14H150V33V87H14V35V14Z" fill="url(#paint1_linear_3_818)" fillOpacity="0.3" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="101" id="filter0_f_3_818" width="164" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_3_818" stdDeviation="7" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_818" x1="83.9807" x2="83" y1="9.91579" y2="127">
              <stop offset="0.195856" stopColor="#2FB8FF" stopOpacity="0" />
              <stop offset="0.546579" stopColor="#4BC6F5" stopOpacity="0.4" />
              <stop offset="0.83609" stopColor="#6BD4EB" stopOpacity="0.7" />
              <stop offset="1" stopColor="#85E0E1" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_3_818" x1="70.0548" x2="69.9301" y1="18.4401" y2="103.487">
              <stop stopColor="#EBEEFE" stopOpacity="0" />
              <stop offset="0.409309" stopColor="#8DE1EB" stopOpacity="0.5" />
              <stop offset="0.674333" stopColor="#8FB6E6" stopOpacity="0.7" />
              <stop offset="0.895165" stopColor="#5DAAB3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Battery() {
  return (
    <div className="h-[112px] relative shrink-0 w-[274px]" data-name="Battery">
      <BatteryBase />
      <BatteryCharge />
      <NeonEffect />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="50%">
      <div className="h-[9px] relative shrink-0 w-0">
        <div className="absolute bottom-0 left-[-1px] right-[-1px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
            <path d="M1 0V9" id="Vector 21" stroke="url(#paint0_linear_3_814)" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_814" x1="1.5" x2="1.5" y1="0" y2="9">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-nowrap text-white tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">75%</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0" data-name="100%">
      <div className="h-[9px] relative shrink-0 w-0">
        <div className="absolute bottom-0 left-[-1px] right-[-1px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 9">
            <path d="M1 0V9" id="Vector 21" opacity="0.6" stroke="url(#paint0_linear_3_808)" strokeWidth="2" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_808" x1="1.5" x2="1.5" y1="0" y2="9">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-nowrap tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">100%</p>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[35px] items-start justify-end relative shrink-0 w-[273px]" data-name="%">
      <Component1 />
      <Component2 />
    </div>
  );
}

function Slider() {
  return (
    <div className="h-[18px] relative shrink-0 w-[273px]" data-name="Slider">
      <div className="absolute bg-[rgba(36,37,40,0.7)] h-[9px] left-0 rounded-[25px] top-[6px] w-[273px]">
        <div className="absolute inset-0 pointer-events-none shadow-[-2px_-2px_4px_0px_inset_rgba(255,255,255,0.08),2px_2px_4px_0px_inset_rgba(0,0,0,0.8)]" />
      </div>
      <div className="absolute h-[18px] left-[191px] top-0 w-[24px]">
        <div className="absolute inset-[-29.95%_-29.55%_-105.56%_-64.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47 43">
            <g filter="url(#filter0_d_3_806)" id="Vector 12">
              <path d={svgPaths.p2732a080} fill="url(#paint0_linear_3_806)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42.3918" id="filter0_d_3_806" width="46.5291" x="2.38419e-07" y="-2.38419e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-4" dy="6" />
                <feGaussianBlur stdDeviation="6.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="overlay" result="effect1_dropShadow_3_806" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_806" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_806" x1="27.437" x2="27.437" y1="5.39181" y2="23.3918">
                <stop stopColor="#2FB8FF" />
                <stop offset="1" stopColor="#9EECD9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Battery1() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[199px] items-center justify-between left-1/2 px-[28px] py-0 top-[262px] translate-x-[-50%]" data-name="Battery">
      <Battery />
      <Component />
      <Slider />
      <div className="flex flex-col font-['SF_Pro_Text:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[rgba(235,235,245,0.6)] text-nowrap tracking-[-0.078px]">
        <p className="leading-[18px] whitespace-pre">Set Charge Limit</p>
      </div>
    </div>
  );
}

function LeftArrowIcon() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Left arrow icon">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22.5px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀆉</p>
      </div>
    </div>
  );
}

function LeftArrowButton() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Left Arrow Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <LeftArrowIcon />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Title">
      <div className="flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[28px] text-nowrap text-white tracking-[0.36px]">
        <p className="leading-[normal] whitespace-pre">Charging</p>
      </div>
    </div>
  );
}

function Setting() {
  return (
    <div className="absolute left-[9px] size-[44px] top-[9px]" data-name="Setting">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] justify-center leading-[0] left-[22px] not-italic text-[17px] text-[rgba(235,235,245,0.6)] text-center text-nowrap top-[22px] tracking-[-0.408px] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[22px] whitespace-pre">􀣋</p>
      </div>
    </div>
  );
}

function SettingButton() {
  return (
    <div className="relative shrink-0 size-[62px]" data-name="Setting Button">
      <div className="absolute left-0 size-[62px] top-0">
        <div className="absolute inset-[-32.26%_-48.39%_-48.39%_-32.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 112 112">
            <g filter="url(#filter0_df_3_837)" id="Ellipse 836">
              <circle cx="51" cy="51" fill="url(#paint0_radial_3_837)" r="31" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="112" id="filter0_df_3_837" width="112" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="10" dy="10" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3_837" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_3_837" mode="normal" result="shape" />
                <feGaussianBlur result="effect2_foregroundBlur_3_837" stdDeviation="10" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(37.5 27) rotate(46.017) scale(59.7599)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_837" r="1">
                <stop stopColor="#5D6167" />
                <stop offset="1" stopColor="#13151A" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="25" cy="25" fill="url(#paint0_radial_3_798)" fillOpacity="0.5" id="Ellipse 837" r="25" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(22.5 13) rotate(38.6598) scale(28.8141)" gradientUnits="userSpaceOnUse" id="paint0_radial_3_798" r="1">
              <stop stopColor="#545659" />
              <stop offset="1" stopColor="#232629" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[6px] size-[50px] top-[6px]">
        <div className="absolute inset-[-1.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 52">
            <g id="Ellipse 838">
              <circle cx="25.75" cy="25.75" r="25" stroke="url(#paint0_linear_3_812)" strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_3_812" x1="9.25" x2="46.75" y1="14.25" y2="60.25">
                <stop stopOpacity="0.45" />
                <stop offset="0.992881" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Setting />
    </div>
  );
}

function Title1() {
  return (
    <div className="absolute box-border content-stretch flex items-center justify-between left-[-2px] px-[30px] py-0 right-[-2px] top-[62px]" data-name="Title">
      <LeftArrowButton />
      <Title />
      <SettingButton />
    </div>
  );
}

function Battery2() {
  return (
    <div className="absolute contents left-[calc(83.33%+31px)] top-[17.33px] translate-x-[-50%]" data-name="Battery">
      <div className="absolute h-[11.333px] left-[calc(83.33%+29.83px)] top-[17.33px] translate-x-[-50%] w-[22px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 12">
          <path d={svgPaths.p7e6b880} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
      <div className="absolute h-[4px] left-[calc(83.33%+42.5px)] top-[21px] translate-x-[-50%] w-[1.328px]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.p32d253c0} fill="var(--fill-0, white)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.333px] left-[calc(83.33%+29.83px)] top-[19.33px] translate-x-[-50%] w-[18px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 8">
          <path d={svgPaths.p22aabe00} fill="var(--fill-0, white)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function RightSide() {
  return (
    <div className="absolute contents left-[calc(83.33%+9.83px)] top-[17.33px] translate-x-[-50%]" data-name="Right Side">
      <Battery2 />
      <div className="absolute h-[10.966px] left-[calc(83.33%+6.16px)] top-[17.33px] translate-x-[-50%] w-[15.272px]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 11">
          <path clipRule="evenodd" d={svgPaths.pbfdb600} fill="var(--fill-0, white)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
      <div className="absolute h-[10.667px] left-[calc(83.33%-15px)] top-[17.67px] translate-x-[-50%] w-[17px]" data-name="Mobile Signal">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 11">
          <path clipRule="evenodd" d={svgPaths.p2836df00} fill="var(--fill-0, white)" fillRule="evenodd" id="Mobile Signal" />
        </svg>
      </div>
    </div>
  );
}

function StatusBarTime() {
  return (
    <div className="absolute h-[21px] left-[calc(16.67%-14.83px)] rounded-[24px] top-[12px] translate-x-[-50%] w-[54px]" data-name="_StatusBar-time">
      <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',sans-serif] h-[20px] justify-center leading-[0] left-[27px] not-italic text-[15px] text-center text-white top-[11px] tracking-[-0.5px] translate-x-[-50%] translate-y-[-50%] w-[54px]">
        <p className="leading-[20px]">9:41</p>
      </div>
    </div>
  );
}

function LeftSide() {
  return (
    <div className="absolute contents left-[calc(16.67%-14.83px)] top-[12px] translate-x-[-50%]" data-name="Left Side">
      <StatusBarTime />
    </div>
  );
}

function StatusBarIPhone1313Pro() {
  return (
    <div className="absolute h-[44px] left-[-2px] overflow-clip right-[-1px] top-[-2px]" data-name="StatusBar / iPhone 13 & 13 Pro">
      <RightSide />
      <LeftSide />
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-[-2px] h-[34px] left-[6px] right-[5px]" data-name="HomeIndicator">
      <div className="absolute bg-white bottom-[8px] h-[5px] left-[calc(50%+0.5px)] rounded-[100px] translate-x-[-50%] w-[134px]" data-name="Home Indicator" />
    </div>
  );
}

export default function Screen() {
  return (
    <div className="bg-gradient-to-b border-2 border-[rgba(255,255,255,0.6)] border-solid from-[#2a2d32] overflow-clip relative rounded-[40px] size-full to-[#1d1d1d] to-[99.171%]" data-name="Screen 3">
      <div className="absolute h-[314px] left-[calc(50%-159px)] top-[188px] translate-x-[-50%] w-[308px]" data-name="Neon Background">
        <div className="absolute inset-[-63.69%_-64.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 708 714">
            <g filter="url(#filter0_f_3_843)" id="Neon Background">
              <ellipse cx="354" cy="357" fill="var(--fill-0, #56CCF2)" fillOpacity="0.1" rx="154" ry="157" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="714" id="filter0_f_3_843" width="708" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_3_843" stdDeviation="100" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <DropdownTableRow />
      <TabBar1 />
      <Battery1 />
      <div className="absolute flex flex-col font-['SF_Pro_Display:Bold',sans-serif] justify-center leading-[0] left-[193px] not-italic text-[0px] text-center text-nowrap text-white top-[305.5px] tracking-[0.374px] translate-x-[-50%] translate-y-[-50%]">
        <p className="whitespace-pre">
          <span className="font-['SF_Pro_Display:Bold',sans-serif] leading-[41px] text-[34px] text-white tracking-[0.374px]">65</span>
          <span className="font-['SF_Pro_Display:Semibold',sans-serif] leading-[24px] text-[20px] text-[rgba(235,235,245,0.6)] tracking-[0.38px]">%</span>
        </p>
      </div>
      <div className="absolute h-[221.119px] left-[calc(50%+0.15px)] top-[114px] translate-x-[-50%] w-[382.303px]" data-name="image 40">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage40} />
      </div>
      <Title1 />
      <StatusBarIPhone1313Pro />
      <HomeIndicator />
    </div>
  );
}