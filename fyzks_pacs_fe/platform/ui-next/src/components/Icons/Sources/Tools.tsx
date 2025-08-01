import React from 'react';
import type { IconProps } from '../types';

export const ToolLayout = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>tool-layout</title>
    <g
      id="tool-layout"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group"
        transform="translate(0.5, 4)"
        strokeLinecap="round"
      >
        <g
          id="Group-3"
          transform="translate(0, 0)"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path
            d="M5.45696821e-12,9.49450549 L5.45696821e-12,17.3947362 C5.45710348e-12,18.4993057 0.8954305,19.3947362 2,19.3947362 L13.2443085,19.3947362 L13.2443085,19.3947362"
            id="Path-3"
          ></path>
          <path
            d="M9.49450549,0 L9.49450549,4.91369247 L9.49450549,6 C9.49450549,7.1045695 10.389936,8 11.4945055,8 L19.195248,8 L19.195248,8"
            id="Path-3"
            transform="translate(14.3449, 4) rotate(180) translate(-14.3449, -4)"
          ></path>
          <path
            d="M0.0997440877,-0.0997440877 L0.0997440877,7.80048659 C0.0997440877,8.90505609 0.995174588,9.80048659 2.09974409,9.80048659 L9.80048659,9.80048659 L9.80048659,9.80048659"
            id="Path-3"
            transform="translate(4.9501, 4.8504) rotate(90) translate(-4.9501, -4.8504)"
          ></path>
        </g>
        <g
          id="Group-10"
          opacity="0.550000012"
          transform="translate(2, 2)"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line
            x1="7.5"
            y1="14.5"
            x2="7.5"
            y2="0.5"
            id="Line-2"
          ></line>
          <line
            x1="7"
            y1="14"
            x2="7"
            y2="1"
            id="Line-2"
            transform="translate(7, 7.5) rotate(90) translate(-7, -7.5)"
          ></line>
        </g>
        <g
          id="gear"
          transform="translate(21.0876, 17.2796) rotate(-20) translate(-21.0876, -17.2796)translate(15.9634, 11.5127)"
          stroke="#348CFD"
          strokeLinejoin="round"
          strokeWidth="1.25"
        >
          <circle
            id="Oval"
            cx="5.12378058"
            cy="5.76719178"
            r="1.28158482"
          ></circle>
          <path
            d="M6.21361819,0.80762797 L6.59086967,2.04907966 C6.72061095,2.47639719 7.15892721,2.73042581 7.59419808,2.63056421 L8.85259487,2.33893009 C9.34216301,2.22858155 9.84650092,2.45011894 10.0964357,2.88530436 C10.3463705,3.32048979 10.2835655,3.86774756 9.94154064,4.23499782 L9.06128718,5.18481538 C8.75980718,5.51248709 8.75980718,6.0165454 9.06128718,6.3442171 L9.94154064,7.29403466 C10.2835655,7.66128493 10.3463705,8.2085427 10.0964357,8.64372812 C9.84650092,9.07891354 9.34216301,9.30045094 8.85259487,9.1901024 L7.59419808,8.89846827 C7.15663131,8.79632613 6.71524652,9.05279063 6.58730228,9.48352022 L6.2100508,10.7249719 C6.0649735,11.2053044 5.62242271,11.5339347 5.12065911,11.5339347 C4.61889551,11.5339347 4.17634472,11.2053044 4.03126742,10.7249719 L3.65669148,9.48352022 C3.52807698,9.05567912 3.08963152,8.80095947 2.65425492,8.90114382 L1.39585813,9.19277794 C0.90628999,9.30312648 0.401952083,9.08158909 0.152017275,8.64640366 C-0.0979175321,8.21121824 -0.035112502,7.66396047 0.306912358,7.29671021 L1.18716582,6.34689264 C1.48864582,6.01922094 1.48864582,5.51516263 1.18716582,5.18749093 L0.306912358,4.23767336 C-0.035112502,3.8704231 -0.0979175321,3.32316533 0.152017275,2.88797991 C0.401952083,2.45279448 0.90628999,2.23125709 1.39585813,2.34160563 L2.65425492,2.63323975 C3.08937078,2.73350334 3.52770594,2.47923776 3.65669148,2.0517552 L4.03483481,0.810303513 C4.17932126,0.32979188 4.62146882,0.000617032116 5.12323309,0 C5.62499736,-0.000615299293 6.06795204,0.327472644 6.21361819,0.80762797 Z"
            id="Path"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export const ToolAutoZoom = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
  <rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" rx="2"/>

  <rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" rx="1"/>

  <path d="M7 9L4 6L7 3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  <path d="M17 3L20 6L17 9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  <path d="M7 21L4 18L7 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  <path d="M17 15L20 18L17 21" stroke="currentColor" strokeWidth="1.5" fill="none"/>

  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  <line x1="14" y1="14" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5"/>
</svg>
);

export const ToolClickSegment = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M18.7855 10.7063C19.0677 8.68223 18.754 6.39013 17.3334 4.86666C15.7881 3.20953 13.3171 2.78346 11.098 3.09398C9.51269 3.31581 7.93737 4.03721 6.63198 5.25454C5.24718 6.54592 4.39791 8.17926 4.11016 9.84527C3.74697 11.9481 4.27832 14.1031 5.75643 15.6882C7.30168 17.3453 9.54033 18.0136 11.7594 17.7031"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15.0003 18.562L15.0714 12.3038C15.0714 12.1629 15.1293 12.0689 15.2452 12.0219C15.3663 11.9749 15.4769 12.0036 15.577 12.108L19.8981 16.502C20.0034 16.6169 20.0271 16.7318 19.9692 16.8467C19.9165 16.9615 19.8164 17.0216 19.669 17.0268L17.9627 17.0973L19.353 20.2929C19.3899 20.366 19.3951 20.4391 19.3688 20.5123C19.3477 20.5854 19.303 20.6376 19.2345 20.6689L18.4445 20.9822C18.3708 21.0083 18.2997 21.0057 18.2312 20.9744C18.1628 20.943 18.1128 20.8908 18.0812 20.8177L16.754 17.5673L15.5533 18.7656C15.4532 18.8648 15.3347 18.8935 15.1978 18.8518C15.0609 18.81 14.995 18.7134 15.0003 18.562Z"
      fill="currentColor"
    />
  </svg>
);

export const ToolLength = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-length"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="ruler"
        transform="translate(2, 2.5)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          id="Rectangle"
          strokeWidth="1.5"
          transform="translate(11.5003, 11.5005) rotate(-45.001) translate(-11.5003, -11.5005)"
          x="-0.874220029"
          y="7.6109894"
          width="24.749"
          height="7.779"
          rx="1"
        ></rect>
        <line
          x1="5.11737261"
          y1="12.3844231"
          x2="7.13237261"
          y2="14.3684231"
          id="Path"
        ></line>
        <line
          x1="7.68571234"
          y1="9.81508336"
          x2="10.1857123"
          y2="12.3150834"
          id="Path"
        ></line>
        <line
          x1="10.1225521"
          y1="7.37924362"
          x2="11.8725521"
          y2="9.12924362"
          id="Path"
        ></line>
        <line
          x1="12.5583918"
          y1="4.94240389"
          x2="15.0583918"
          y2="7.44240389"
          id="Path"
        ></line>
        <line
          x1="15.1127315"
          y1="2.38806416"
          x2="17.1277315"
          y2="4.37406416"
          id="Path"
        ></line>
        <line
          x1="2.56403288"
          y1="14.9377628"
          x2="5.06403288"
          y2="17.4377628"
          id="Path"
        ></line>
      </g>
    </g>
  </svg>
);

export const Tool3DRotate = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-3d-rotate"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      />
      <g
        id="Group"
        transform="translate(4, 3)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <g id="group">
          <polyline
            id="Path"
            points="6 21.996 8.5 19.998 6 17.996"
          />
          <path
            d="M8.5,19.998 C5.038,20.652 1,18.498 0,14.998"
            id="Path"
          />
          <polyline
            id="Path"
            points="14 0 11.5 1.998 14 4"
          />
          <path
            d="M11.5,1.998 C14.962,1.344 19,3.498 20,6.998"
            id="Path"
          />
        </g>
        <g
          id="3d"
          transform="translate(5, 5.75)"
        >
          <polygon
            id="Path"
            points="5 0 0 2.1875 5 4.375 10 2.1875"
          />
          <polyline
            id="Path"
            points="0 2.1875 0 8.125 5 10.3125 10 8.125 10 2.1875"
          />
          <line
            x1="5"
            y1="4.375"
            x2="5"
            y2="10.3125"
            id="Path"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const ToolAngle = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-angle"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      />
      <g
        id="Group-6"
        transform="translate(2.4559, 6)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <line
          x1="2.5"
          y1="14.5"
          x2="20.6875"
          y2="14.4375"
          id="Line-4"
        />
        <line
          x1="1"
          y1="13.3775095"
          x2="13.0650095"
          y2="1.3125"
          id="Line-4"
          transform="translate(7.0325, 7.345) rotate(-10) translate(-7.0325, -7.345)"
        />
      </g>
      <path
        d="M19.3390559,17.0930296 C19.4124327,13.0930296 17.4130821,11.0930296 13.3410041,11.0930296"
        id="Path-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1,2.7"
        transform="translate(16.341, 14.093) rotate(12) translate(-16.341, -14.093)"
      />
    </g>
  </svg>
);

export const ToolAnnotate = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-annotate"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      />
      <g
        id="Group"
        transform="translate(4, 3.3899)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <polyline
          id="Path"
          points="8.59335038 20.2520716 -6.1284311e-14 20.2520716 -6.1284311e-14 11.6587212"
        />
        <line
          x1="-4.08562073e-14"
          y1="20.2520716"
          x2="19.6419437"
          y2="0.610127877"
          id="Path"
        />
      </g>
    </g>
  </svg>
);

export const ToolBidirectional = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>tool-bidirectional</title>
    <g
      id="tool-bidirectional"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="group"
        transform="translate(2.5, 2.5)"
        stroke="currentColor"
      >
        <g
          id="Group-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M19.7288691,-0.335661423 C20.1766848,-0.335701004 20.6245155,-0.164922663 20.9661629,0.176604012 L22.785192,1.99444856 C23.0988548,2.30800052 23.2685446,2.7110041 23.2944775,3.12134197 C23.3217954,3.55359523 23.188997,3.99381095 22.8972982,4.34658876 L4.09686309,23.1566959 C3.72728287,23.5261645 3.24294798,23.7108988 2.75861309,23.7108988 C2.2742782,23.7108988 1.78994331,23.5261645 1.420283,23.1566158 L-0.19579707,21.5405357 C-0.56526569,21.1709555 -0.75,20.6866206 -0.75,20.2022857 C-0.75,19.7179508 -0.56526569,19.2336159 -0.195713448,18.8639521 L18.4915869,0.176901703 C18.833253,-0.16476434 19.2810535,-0.335621842 19.7288691,-0.335661423 Z"
            id="Path"
            strokeWidth="1.5"
          ></path>
          <line
            x1="4.1448988"
            y1="18.9142857"
            x2="5.71632738"
            y2="20.4765714"
            id="Path"
          ></line>
          <line
            x1="6.5688988"
            y1="16.4902857"
            x2="8.14261309"
            y2="18.0502857"
            id="Path"
          ></line>
          <line
            x1="8.9928988"
            y1="14.0662857"
            x2="10.5654702"
            y2="15.6274286"
            id="Path"
          ></line>
          <line
            x1="11.4168988"
            y1="11.6422857"
            x2="12.9917559"
            y2="13.2011429"
            id="Path"
          ></line>
          <line
            x1="13.8408988"
            y1="9.21714286"
            x2="15.4066131"
            y2="10.7874286"
            id="Path"
          ></line>
          <line
            x1="16.1345622"
            y1="6.9234795"
            x2="17.7002765"
            y2="8.49376521"
            id="Path"
          ></line>
          <line
            x1="18.5589283"
            y1="4.49911339"
            x2="20.1246426"
            y2="6.0693991"
            id="Path"
          ></line>
        </g>
        <path
          d="M9.21155442,3 L3.86096848,3 C3.30868373,3 2.86096848,3.44771525 2.86096848,4 L2.86096848,6.5 C2.86096848,7.05228475 3.30868373,7.5 3.86096848,7.5 L9.21155442,7.5 L9.21155442,7.5"
          id="Path-6"
          strokeWidth="1.5"
          transform="translate(6.0363, 5.25) rotate(-315) translate(-6.0363, -5.25)"
        ></path>
        <path
          d="M21.0115544,14.7862614 L15.6609685,14.7862614 C15.1086837,14.7862614 14.6609685,15.2339767 14.6609685,15.7862614 L14.6609685,18.2862614 C14.6609685,18.8385462 15.1086837,19.2862614 15.6609685,19.2862614 L21.0115544,19.2862614 L21.0115544,19.2862614"
          id="Path-6"
          strokeWidth="1.5"
          transform="translate(17.8363, 17.0363) rotate(-135) translate(-17.8363, -17.0363)"
        ></path>
      </g>
    </g>
  </svg>
);

export const ToolCalibrate = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-calibrate"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="calibrate"
        transform="translate(2.5, 16.5)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
      >
        <polyline
          id="Path"
          points="20 6 23 3 20 0"
        ></polyline>
        <line
          x1="1"
          y1="3"
          x2="22"
          y2="3"
          id="Path"
        ></line>
        <polyline
          id="Path"
          points="3 6 0 3 3 0"
        ></polyline>
      </g>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.25"
        x="2"
        y="5"
        width="24"
        height="6"
        rx="2"
      ></rect>
      <line
        x1="6.5"
        y1="10.5"
        x2="6.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
      <line
        x1="9.5"
        y1="10.5"
        x2="9.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
      <line
        x1="12.5"
        y1="10.5"
        x2="12.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
      <line
        x1="15.5"
        y1="10.5"
        x2="15.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
      <line
        x1="18.5"
        y1="10.5"
        x2="18.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
      <line
        x1="21.5"
        y1="10.5"
        x2="21.5"
        y2="8.5"
        id="Line-5"
        stroke="currentColor"
        strokeLinecap="round"
      ></line>
    </g>
  </svg>
);

export const ToolCapture = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>tool-</title>
    <g
      id="tool-"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <path
        d="M8.64381845,8.55555556 C9.05021618,8.5340019 9.43897503,8.38261884 9.75292956,8.12366667 L11.6057073,6.43188889 C11.919523,6.17269999 12.308363,6.02128533 12.7148185,6 L15.6179296,6 C16.0208348,6.0234362 16.4057732,6.17472593 16.7168185,6.43188889 L18.5695962,8.12366667 C18.8835508,8.38261884 19.2723096,8.5340019 19.6787073,8.55555556 L23.1057073,8.55555556 C24.2042675,8.66849081 25.0354336,9.60050503 25.0225258,10.7047778 L25.0225258,19.4166667 C25.0225258,20.4752124 24.1642531,21.3333333 23.1057073,21.3333333 L5.21681845,21.3333333 C4.15827268,21.3333333 3.3,20.4752124 3.3,19.4166667 L3.3,10.7047778 C3.28709219,9.60050503 4.11825826,8.66849081 5.21681845,8.55555556 L8.64381845,8.55555556 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="14.1612629"
        cy="13.9861111"
        r="3.51388889"
      ></circle>
      <path
        d="M21.8279296,11.4305556 C22.0043539,11.4305556 22.147374,11.5735757 22.147374,11.75 C22.147374,11.9264243 22.0043539,12.0694444 21.8279296,12.0694444 C21.6515053,12.0694444 21.5084851,11.9264243 21.5084851,11.75 C21.5084851,11.5735757 21.6515053,11.4305556 21.8279296,11.4305556"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export const ToolCine = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-cine"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="14"
        cy="13.9990833"
        r="10.5416667"
      ></circle>
      <path
        d="M11.5416667,11.7236444 L17.3036401,14.0295711 L11.5416667,16.9105578 L11.5416667,11.7236444 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
      ></path>
    </g>
  </svg>
);

export const ToolCircle = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-circle"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        cx="14"
        cy="14"
        r="9.5"
      ></circle>
    </g>
  </svg>
);

export const ToolCobbAngle = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-cobb-angle"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group"
        transform="translate(6.5, 0.68)"
        fill="currentColor"
      >
        <path
          d="M8.5,10.1817844 C9.88071187,10.1817844 11,11.3010725 11,12.6817844 L11,13.6817844 C11,15.0624963 9.88071187,16.1817844 8.5,16.1817844 L2.5,16.1817844 C1.11928813,16.1817844 0,15.0624963 0,13.6817844 L0,12.6817844 C0,11.3010725 1.11928813,10.1817844 2.5,10.1817844 L8.5,10.1817844 Z M8.5,11.6817844 L2.5,11.6817844 C1.94771525,11.6817844 1.5,12.1294997 1.5,12.6817844 L1.5,13.6817844 C1.5,14.2340692 1.94771525,14.6817844 2.5,14.6817844 L8.5,14.6817844 C9.05228475,14.6817844 9.5,14.2340692 9.5,13.6817844 L9.5,12.6817844 C9.5,12.1294997 9.05228475,11.6817844 8.5,11.6817844 Z"
          id="Rectangle"
          fillRule="nonzero"
        ></path>
        <circle
          id="Oval"
          cx="6.5"
          cy="8.6976195"
          r="1"
        ></circle>
        <circle
          id="Oval"
          cx="6.5"
          cy="17.6976195"
          r="1"
        ></circle>
        <path
          d="M11.5,1.70018865 C12.8807119,1.70018865 14,2.81947678 14,4.20018865 L14,5.20018865 C14,6.58090053 12.8807119,7.70018865 11.5,7.70018865 L5.5,7.70018865 C4.11928813,7.70018865 3,6.58090053 3,5.20018865 L3,4.20018865 C3,2.81947678 4.11928813,1.70018865 5.5,1.70018865 L11.5,1.70018865 Z M11.5,3.20018865 L5.5,3.20018865 C4.94771525,3.20018865 4.5,3.6479039 4.5,4.20018865 L4.5,5.20018865 C4.5,5.7524734 4.94771525,6.20018865 5.5,6.20018865 L11.5,6.20018865 C12.0522847,6.20018865 12.5,5.7524734 12.5,5.20018865 L12.5,4.20018865 C12.5,3.6479039 12.0522847,3.20018865 11.5,3.20018865 Z"
          id="Rectangle"
          fillRule="nonzero"
          transform="translate(8.5, 4.7002) rotate(20) translate(-8.5, -4.7002)"
        ></path>
        <path
          d="M11.5,18.7001887 C12.8807119,18.7001887 14,19.8194768 14,21.2001887 L14,22.2001887 C14,23.5809005 12.8807119,24.7001887 11.5,24.7001887 L5.5,24.7001887 C4.11928813,24.7001887 3,23.5809005 3,22.2001887 L3,21.2001887 C3,19.8194768 4.11928813,18.7001887 5.5,18.7001887 L11.5,18.7001887 Z M11.5,20.2001887 L5.5,20.2001887 C4.94771525,20.2001887 4.5,20.6479039 4.5,21.2001887 L4.5,22.2001887 C4.5,22.7524734 4.94771525,23.2001887 5.5,23.2001887 L11.5,23.2001887 C12.0522847,23.2001887 12.5,22.7524734 12.5,22.2001887 L12.5,21.2001887 C12.5,20.6479039 12.0522847,20.2001887 11.5,20.2001887 Z"
          id="Rectangle"
          fillRule="nonzero"
          transform="translate(8.5, 21.7002) rotate(-20) translate(-8.5, -21.7002)"
        ></path>
      </g>
    </g>
  </svg>
);

export const ToolCTR = (props: IconProps) => (
  <svg width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
     xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="10" ry="8" stroke="currentColor" stroke-width="1.5" fill="none"/>

    <path d="M12 8.5c-1.5-2-4-2-4 0.5c0 1.5 2 3 4 5c2-2 4-3.5 4-5c0-2.5-2.5-2.5-4-0.5z"
          stroke="currentColor" stroke-width="1.5" fill="none"/>

    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

    <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>

    <circle cx="2" cy="12" r="1" fill="currentColor"/>
    <circle cx="22" cy="12" r="1" fill="currentColor"/>
    <circle cx="6" cy="16" r="1" fill="currentColor"/>
    <circle cx="18" cy="16" r="1" fill="currentColor"/>
  </svg>
);

export const ToolSpineLabel = (props: IconProps) => (
  <svg width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fill-rule="evenodd">
          <rect width="28" height="28" fill="none"/>
          <g transform="translate(6, 6)" stroke="#fff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6,1 C 6,1 7,3 6,5 C 5,7 7,9 6,11 C 5,13 6,15 6,15" />

              <path d="M3,1.5 C 3,1.5 4.5,0.5 6,1.5 C 7.5,2.5 9,1.5 9,1.5" />
              <path d="M3,4.5 C 3,4.5 4.5,3.5 6,4.5 C 7.5,5.5 9,4.5 9,4.5" />
              <path d="M3,7.5 C 3,7.5 4.5,6.5 6,7.5 C 7.5,8.5 9,7.5 9,7.5" />
              <path d="M3,10.5 C 3,10.5 4.5,9.5 6,10.5 C 7.5,11.5 9,10.5 9,10.5" />
              <path d="M3,13.5 C 3,13.5 4.5,12.5 6,13.5 C 7.5,14.5 9,13.5 9,13.5" />

              <circle cx="6" cy="1.5" r="0.5" fill="#348CFD"/>
              <circle cx="6" cy="4.5" r="0.5" fill="#348CFD"/>
              <circle cx="6" cy="7.5" r="0.5" fill="#348CFD"/>
              <circle cx="6" cy="10.5" r="0.5" fill="#348CFD"/>
              <circle cx="6" cy="13.5" r="0.5" fill="#348CFD"/>
          </g>
      </g>
  </svg>
);

export const ToolCreateThreshold = (props: IconProps) => (
  <svg
    width="25px"
    height="25px"
    viewBox="0 0 25 25"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="create-threshold"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <polyline
        id="Path-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="18.85656 16.2174437 21.3536565 13.7203472 23.850753 16.2174437"
      ></polyline>
      <polyline
        id="Path-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(21.353657, 21.471076) scale(1, -1) translate(-21.353657, -21.471076) "
        points="18.85656 22.7196245 21.3536565 20.222528 23.850753 22.7196245"
      ></polyline>
      <path
        d="M21.8903104,6.56040847 L11.830485,16.6215711 C11.7372012,16.7144344 11.6185826,16.7776976 11.4894966,16.8034316 L7.65571758,17.5696525 C7.43667607,17.6132586 7.21032569,17.5446155 7.05240058,17.3866904 C6.89447547,17.2287653 6.8258324,17.0024149 6.86943853,16.7833734 L7.63565944,12.9509316 C7.66176759,12.8216917 7.72550512,12.7030561 7.81885711,12.6099433 L17.8786825,2.54878063 C18.9836118,1.44420272 20.7746834,1.44420272 21.8796127,2.54878063 L21.8903104,2.56081551 C22.9947353,3.66528595 22.9947353,5.45593803 21.8903104,6.56040847 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <line
        x1="9.60946699"
        y1="12.6534866"
        x2="11.9466763"
        y2="14.9906958"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      ></line>
      <path
        d="M-5.52848657,13.180889 L-5.52848657,15.180889 C-5.52848657,16.7687077 -4.24130523,18.055889 -2.65348657,18.055889 L-1.21495403,18.055889 C-0.731704876,18.055889 -0.339954032,17.6641382 -0.339954032,17.180889 C-0.339954032,16.6976399 -0.731704876,16.305889 -1.21495403,16.305889 L-2.65348657,16.305889 C-3.27480692,16.305889 -3.77848657,15.8022094 -3.77848657,15.180889 L-3.77848657,13.180889 C-3.77848657,12.6976399 -4.17023742,12.305889 -4.65348657,12.305889 C-5.13673573,12.305889 -5.52848657,12.6976399 -5.52848657,13.180889 Z M3.03504597,18.055889 L9.53504597,18.055889 C10.0182951,18.055889 10.410046,17.6641382 10.410046,17.180889 C10.410046,16.6976399 10.0182951,16.305889 9.53504597,16.305889 L3.03504597,16.305889 C2.55179681,16.305889 2.16004597,16.6976399 2.16004597,17.180889 C2.16004597,17.6641382 2.55179681,18.055889 3.03504597,18.055889 Z M13.785046,18.055889 L15.180889,18.055889 C16.7687077,18.055889 18.055889,16.7687077 18.055889,15.180889 L18.055889,13.1381996 C18.055889,12.6549504 17.6641382,12.2631996 17.180889,12.2631996 C16.6976399,12.2631996 16.305889,12.6549504 16.305889,13.1381996 L16.305889,15.180889 C16.305889,15.8022094 15.8022094,16.305889 15.180889,16.305889 L13.785046,16.305889 C13.3017968,16.305889 12.910046,16.6976399 12.910046,17.180889 C12.910046,17.6641382 13.3017968,18.055889 13.785046,18.055889 Z M18.055889,8.88819957 L18.055889,6.65348657 C18.055889,6.17023742 17.6641382,5.77848657 17.180889,5.77848657 C16.6976399,5.77848657 16.305889,6.17023742 16.305889,6.65348657 L16.305889,8.88819957 C16.305889,9.37144872 16.6976399,9.76319957 17.180889,9.76319957 C17.6641382,9.76319957 18.055889,9.37144872 18.055889,8.88819957 Z"
        id="Path-4"
        fill="currentColor"
        fillRule="nonzero"
        transform="translate(6.263701, 11.917188) scale(1, -1) rotate(90.000000) translate(-6.263701, -11.917188) "
      ></path>
    </g>
  </svg>
);

export const ToolCrosshair = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-crosshair"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="cursor-target-2"
        transform="translate(3, 3)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <line
          x1="11"
          y1="-8.8817842e-16"
          x2="11"
          y2="6"
          id="Path"
        ></line>
        <line
          x1="0"
          y1="11"
          x2="6"
          y2="11"
          id="Path"
        ></line>
        <line
          x1="11"
          y1="22"
          x2="11"
          y2="16"
          id="Path"
        ></line>
        <line
          x1="22"
          y1="11"
          x2="16"
          y2="11"
          id="Path"
        ></line>
        <circle
          id="Oval"
          cx="11.001"
          cy="11.001"
          r="2"
        ></circle>
      </g>
    </g>
  </svg>
);

export const ToolDicomTagBrowser = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-dicom-tag-browser"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group"
        transform="translate(4, 5.5)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <circle
          id="Oval"
          cx="1.73913043"
          cy="1.73913043"
          r="1.73913043"
        ></circle>
        <line
          x1="6.95652174"
          y1="1.73913043"
          x2="20"
          y2="1.73913043"
          id="Path"
        ></line>
        <circle
          id="Oval"
          cx="1.73913043"
          cy="8.69565217"
          r="1.73913043"
        ></circle>
        <line
          x1="6.95652174"
          y1="8.69565217"
          x2="20"
          y2="8.69565217"
          id="Path"
        ></line>
        <circle
          id="Oval"
          cx="1.73913043"
          cy="15.6521739"
          r="1.73913043"
        ></circle>
        <line
          x1="6.95652174"
          y1="15.6521739"
          x2="20"
          y2="15.6521739"
          id="Path"
        ></line>
      </g>
    </g>
  </svg>
);

export const ToolFlipHorizontal = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-flip-horizontal"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <path
        d="M10.6315789,7.31578947 L6,7.31578947 C4.8954305,7.31578947 4,8.21121997 4,9.31578947 L4,18.5789474 C4,19.6835169 4.8954305,20.5789474 6,20.5789474 L10.6315789,20.5789474 L10.6315789,20.5789474"
        id="Path-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M25,7.31578947 L20.3684211,7.31578947 C19.2638516,7.31578947 18.3684211,8.21121997 18.3684211,9.31578947 L18.3684211,18.5789474 C18.3684211,19.6835169 19.2638516,20.5789474 20.3684211,20.5789474 L25,20.5789474 L25,20.5789474"
        id="Path-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1,3.1"
        transform="translate(21.6842, 13.9474) scale(-1, 1) translate(-21.6842, -13.9474)"
      ></path>
      <line
        x1="14.5"
        y1="4.55263158"
        x2="14.5"
        y2="23.3421053"
        id="Line-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></line>
    </g>
  </svg>
);

export const ToolFreehandPolygon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    {...props}
  >
    <g
      id="icon-freehand-sculpt"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line
        id="svg_1"
        y2="2.559367"
        x2="10.184807"
        y1="4.467781"
        x1="8.81711"
      />
      <line
        id="svg_4"
        y2="1.493836"
        x2="11.727442"
        y1="2.766112"
        x1="10.089386"
      />
      <line
        id="svg_7"
        y2="1.080346"
        x2="13.047428"
        y1="1.748291"
        x1="11.345759"
      />
      <line
        id="svg_8"
        y2="1.000829"
        x2="14.351511"
        y1="1.112153"
        x1="12.77707"
      />
      <line
        id="svg_9"
        y2="1.350705"
        x2="15.242104"
        y1="0.905408"
        x1="13.969828"
      />
      <line
        id="svg_10"
        y2="2.098167"
        x2="15.862339"
        y1="1.14396"
        x1="14.955842"
      />
      <line
        id="svg_11"
        y2="3.195505"
        x2="16.41896"
        y1="1.939133"
        x1="15.766918"
      />
      <line
        id="svg_12"
        y2="4.292843"
        x2="16.530284"
        y1="2.925147"
        x1="16.387153"
      />
      <line
        id="svg_16"
        y2="5.644637"
        x2="16.196311"
        y1="3.831643"
        x1="16.593898"
      />
      <line
        id="svg_18"
        y2="7.266789"
        x2="15.623787"
        y1="5.19934"
        x1="16.275829"
      />
      <line
        id="svg_19"
        y2="10.813258"
        x2="14.526449"
        y1="6.726071"
        x1="15.766918"
      />
      <line
        id="svg_20"
        y2="5.056209"
        x2="8.085552"
        y1="4.181519"
        x1="8.976145"
      />
      <line
        id="svg_23"
        y2="5.326568"
        x2="7.481221"
        y1="4.78585"
        x1="8.403621"
      />
      <line
        id="svg_24"
        y2="5.565119"
        x2="6.749662"
        y1="5.294761"
        x1="7.624352"
      />
      <line
        id="svg_25"
        y2="5.994512"
        x2="5.429675"
        y1="5.533312"
        x1="6.956407"
      />
      <line
        id="svg_27"
        y2="6.551133"
        x2="4.284627"
        y1="5.962706"
        x1="5.572807"
      />
      <line
        id="svg_28"
        y2="7.584858"
        x2="3.044158"
        y1="6.392099"
        x1="4.427758"
      />
      <line
        id="svg_29"
        y2="8.84123"
        x2="2.185372"
        y1="7.489437"
        x1="3.219096"
      />
      <line
        id="svg_31"
        y2="10.606513"
        x2="1.644654"
        y1="8.602678"
        x1="2.280792"
      />
      <line
        id="svg_32"
        y2="13.214679"
        x2="1.48562"
        y1="10.352058"
        x1="1.724171"
      />
      <line
        id="svg_33"
        y2="14.375631"
        x2="1.676461"
        y1="12.992031"
        x1="1.453813"
      />
      <line
        id="svg_34"
        y2="15.298031"
        x2="2.264889"
        y1="14.152983"
        x1="1.517427"
      />
      <line
        id="svg_35"
        y2="16.172721"
        x2="3.521261"
        y1="14.948155"
        x1="1.915013"
      />
      <line
        id="svg_36"
        y2="16.824762"
        x2="5.207027"
        y1="15.997783"
        x1="3.28271"
      />
      <line
        id="svg_38"
        y2="17.063314"
        x2="7.035924"
        y1="16.745245"
        x1="4.968475"
      />
      <line
        id="svg_39"
        y2="16.888376"
        x2="9.278311"
        y1="17.047411"
        x1="6.733758"
      />
      <line
        id="svg_40"
        y2="16.284045"
        x2="10.661911"
        y1="16.983797"
        x1="8.992048"
      />
      <line
        id="svg_41"
        y2="15.313934"
        x2="11.647925"
        y1="16.395369"
        x1="10.455166"
      />
      <line
        id="svg_44"
        y2="13.898527"
        x2="12.82478"
        y1="15.425259"
        x1="11.504794"
      />
      <line
        id="svg_45"
        y2="12.037824"
        x2="14.144766"
        y1="14.312017"
        x1="12.522614"
      />
      <line
        id="svg_47"
        y2="10.59061"
        x2="14.605966"
        y1="12.228665"
        x1="13.953925"
      />
      <ellipse
        ry="1"
        rx="1"
        id="svg_48"
        cy="3.982726"
        cx="13.460918"
      />
    </g>
  </svg>
);

export const ToolFreehandRoi = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-freehand-roi"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group-2"
        transform="translate(3, 2)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M0,0 C8,3 5,8.5 2,15.5 C-1,22.5 3.5,23 5,23 C6.08963707,23.0518834 7.15942037,22.6952889 8,22"
          id="Path"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M21.38,12.619 L13.75,20.25 L10,21 L10.75,17.25 L18.38,9.619 C19.2062949,8.79296781 20.5457051,8.79296781 21.372,9.619 L21.38,9.628 C21.7771113,10.0243763 22.000268,10.5624193 22.000268,11.1235 C22.000268,11.6845807 21.7771113,12.2226237 21.38,12.619 L21.38,12.619 Z"
          id="Path"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M10.654274,17.2961006 C11.6738332,18.1907082 12.6933924,19.0853157 13.7129517,19.9799232"
          id="Path-4"
        ></path>
      </g>
    </g>
  </svg>
);

export const ToolFreehand = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    {...props}
  >
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="miter"
    >
      <ellipse
        ry="1"
        rx="1"
        id="svg_3"
        cy="4.240343"
        cx="14.306499"
      />
      <line
        id="svg_4"
        y2="3.58462"
        x2="12.242186"
        y1="3.997482"
        x1="13.432202"
      />
      <line
        id="svg_5"
        y2="3.268901"
        x2="10.857882"
        y1="3.608906"
        x1="12.387902"
      />
      <line
        id="svg_6"
        y2="3.147471"
        x2="9.740724"
        y1="3.293187"
        x1="10.955026"
      />
      <line
        id="svg_7"
        y2="3.147471"
        x2="8.089274"
        y1="3.196043"
        x1="9.983585"
      />
      <line
        id="svg_8"
        y2="3.268901"
        x2="6.874972"
        y1="3.123185"
        x1="8.307848"
      />
      <line
        id="svg_9"
        y2="3.657478"
        x2="5.587812"
        y1="3.220329"
        x1="7.020688"
      />
      <line
        id="svg_10"
        y2="4.046054"
        x2="4.737801"
        y1="3.560334"
        x1="5.854959"
      />
      <line
        id="svg_11"
        y2="4.337487"
        x2="4.300652"
        y1="3.997482"
        x1="4.834945"
      />
      <line
        id="svg_12"
        y2="4.726063"
        x2="3.88779"
        y1="4.191771"
        x1="4.470655"
      />
      <line
        id="svg_15"
        y2="5.3575"
        x2="3.377783"
        y1="4.604633"
        x1="3.960648"
      />
      <line
        id="svg_16"
        y2="6.183226"
        x2="2.916348"
        y1="5.138926"
        x1="3.547785"
      />
      <line
        id="svg_17"
        y2="6.960379"
        x2="2.770632"
        y1="5.867507"
        x1="3.037779"
      />
      <line
        id="svg_18"
        y2="7.713246"
        x2="2.673488"
        y1="6.741804"
        x1="2.819204"
      />
      <line
        id="svg_19"
        y2="8.684687"
        x2="2.697774"
        y1="7.616102"
        x1="2.673488"
      />
      <line
        id="svg_20"
        y2="9.753273"
        x2="2.892062"
        y1="8.611829"
        x1="2.697774"
      />
      <line
        id="svg_21"
        y2="10.724714"
        x2="3.134923"
        y1="9.534698"
        x1="2.84349"
      />
      <line
        id="svg_23"
        y2="11.647583"
        x2="3.596357"
        y1="10.578998"
        x1="3.086351"
      />
      <line
        id="svg_25"
        y2="12.521881"
        x2="4.276366"
        y1="11.501867"
        x1="3.499213"
      />
      <line
        id="svg_26"
        y2="13.930471"
        x2="5.830673"
        y1="12.376165"
        x1="4.13065"
      />
      <line
        id="svg_28"
        y2="14.707624"
        x2="7.263549"
        y1="13.881899"
        x1="5.733528"
      />
      <line
        id="svg_29"
        y2="15.339061"
        x2="8.963571"
        y1="14.61048"
        x1="7.06926"
      />
      <line
        id="svg_30"
        y2="15.581921"
        x2="10.882168"
        y1="15.314775"
        x1="8.817855"
      />
      <line
        id="svg_31"
        y2="15.460491"
        x2="12.023612"
        y1="15.581921"
        x1="10.785024"
      />
      <line
        id="svg_33"
        y2="15.120487"
        x2="13.092197"
        y1="15.484777"
        x1="11.877895"
      />
      <line
        id="svg_34"
        y2="14.586194"
        x2="13.86935"
        y1="15.217631"
        x1="12.897909"
      />
      <line
        id="svg_35"
        y2="13.833327"
        x2="14.597931"
        y1="14.756196"
        x1="13.699348"
      />
      <line
        id="svg_37"
        y2="12.716169"
        x2="15.180796"
        y1="13.881899"
        x1="14.549359"
      />
      <line
        id="svg_39"
        y2="11.429009"
        x2="15.520801"
        y1="12.813313"
        x1="15.15651"
      />
      <ellipse
        ry="1"
        rx="1"
        id="svg_40"
        cy="10.967574"
        cx="15.520801"
      />
    </g>
  </svg>
);

export const ToolFusionColor = (props: IconProps) => (
  <svg
    width="25px"
    height="25px"
    viewBox="0 0 25 25"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <path
        d="M18,2 C19.1045695,2 20,2.8954305 20,4 L20.000443,11.5700239 C18.8210504,10.0206853 17.6279451,8.77097591 17.1182222,8.25530435 C16.9570959,8.09231818 16.733654,8.00006956 16.5,8.00006956 C16.266346,8.00006956 16.0429041,8.09231818 15.8817778,8.25530435 C14.719,9.43165217 10,14.4278261 10,18.0869565 C10,18.7674866 10.1126915,19.4091677 10.3210825,20.0009348 L4,20 C2.8954305,20 2,19.1045695 2,18 L2,4 C2,2.8954305 2.8954305,2 4,2 L18,2 Z"
        id="Combined-Shape"
        stroke="currentColor"
        strokeWidth="1.75"
      ></path>
      <g
        id="color-drop-pick"
        transform="translate(9.591386, 8.000070)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M7.52683573,0.255234787 C7.36570938,0.0922486197 7.14226748,0 6.90861351,0 C6.67495954,0 6.45151764,0.0922486197 6.29039129,0.255234787 C5.12761351,1.43158261 0.408613509,6.42775653 0.408613509,10.086887 C0.408613509,13.5449739 3.31844684,15.9999304 6.90861351,15.9999304 C10.4987802,15.9999304 13.4086135,13.5449739 13.4086135,10.086887 C13.4086135,6.42775653 8.68961351,1.43158261 7.52683573,0.255234787 Z"
          id="Path"
          strokeWidth="1.75"
        ></path>
        <g
          id="Group"
          transform="translate(7.015298, 8.975291) rotate(40.000000) translate(-7.015298, -8.975291) translate(3.731654, 1.974720)"
        >
          <line
            x1="0.5"
            y1="12.5"
            x2="0.5"
            y2="1.56125113e-15"
            id="Path"
          ></line>
          <line
            x1="3.420153"
            y1="1.25018584"
            x2="3.420153"
            y2="14.0011428"
            id="Path"
          ></line>
          <line
            x1="6.06728889"
            y1="1.86765717"
            x2="6.06728889"
            y2="12.7034832"
            id="Path"
          ></line>
        </g>
      </g>
    </g>
  </svg>
);

export const ToolInvert = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-invert"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.5"
        x="4"
        y="5"
        width="20"
        height="18"
        rx="2"
      ></rect>
      <path
        d="M14,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,7 C4,5.8954305 4.8954305,5 6,5 L14,5 L14,8 C10.6862915,8 8,10.6862915 8,14 C8,17.3137085 10.6862915,20 14,20 L14,23 Z"
        id="Combined-Shape"
        fill="currentColor"
      ></path>
      <path
        d="M14,8 C17.3137085,8 20,10.6862915 20,14 C20,17.3137085 17.3137085,20 14,20 Z"
        id="Combined-Shape"
        fill="currentColor"
      ></path>
    </g>
  </svg>
);

export const VerticalSeparatorThick = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    {...props}
    viewBox="0 0 28 28"
  >
    <rect
      x="9"
      y="4"
      width="4"
      height="24"
      fill="currentColor"
      opacity="0.8"
      rx="1"
    />
  </svg>
);

export const ToolLayoutDefault = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-layout"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group"
        transform="translate(0.5, 4)"
        strokeLinecap="round"
      >
        <g
          id="Group-3"
          transform="translate(0, 0)"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          <path
            d="M5.45696821e-12,9.49450549 L5.45696821e-12,17.3947362 C5.45710348e-12,18.4993057 0.8954305,19.3947362 2,19.3947362 L13.2443085,19.3947362 L13.2443085,19.3947362"
            id="Path-3"
          ></path>
          <path
            d="M9.49450549,0 L9.49450549,4.91369247 L9.49450549,6 C9.49450549,7.1045695 10.389936,8 11.4945055,8 L19.195248,8 L19.195248,8"
            id="Path-3"
            transform="translate(14.3449, 4) rotate(180) translate(-14.3449, -4)"
          ></path>
          <path
            d="M0.0997440877,-0.0997440877 L0.0997440877,7.80048659 C0.0997440877,8.90505609 0.995174588,9.80048659 2.09974409,9.80048659 L9.80048659,9.80048659 L9.80048659,9.80048659"
            id="Path-3"
            transform="translate(4.9501, 4.8504) rotate(90) translate(-4.9501, -4.8504)"
          ></path>
        </g>
        <g
          id="Group-10"
          opacity="0.550000012"
          transform="translate(2, 2)"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line
            x1="7.5"
            y1="14.5"
            x2="7.5"
            y2="0.5"
            id="Line-2"
          ></line>
          <line
            x1="7"
            y1="14"
            x2="7"
            y2="1"
            id="Line-2"
            transform="translate(7, 7.5) rotate(90) translate(-7, -7.5)"
          ></line>
        </g>
        <g
          id="gear"
          transform="translate(21.0876, 17.2796) rotate(-20) translate(-21.0876, -17.2796)translate(15.9634, 11.5127)"
          stroke="#348CFD"
          strokeLinejoin="round"
          strokeWidth="1.25"
        >
          <circle
            id="Oval"
            cx="5.12378058"
            cy="5.76719178"
            r="1.28158482"
          ></circle>
          <path
            d="M6.21361819,0.80762797 L6.59086967,2.04907966 C6.72061095,2.47639719 7.15892721,2.73042581 7.59419808,2.63056421 L8.85259487,2.33893009 C9.34216301,2.22858155 9.84650092,2.45011894 10.0964357,2.88530436 C10.3463705,3.32048979 10.2835655,3.86774756 9.94154064,4.23499782 L9.06128718,5.18481538 C8.75980718,5.51248709 8.75980718,6.0165454 9.06128718,6.3442171 L9.94154064,7.29403466 C10.2835655,7.66128493 10.3463705,8.2085427 10.0964357,8.64372812 C9.84650092,9.07891354 9.34216301,9.30045094 8.85259487,9.1901024 L7.59419808,8.89846827 C7.15663131,8.79632613 6.71524652,9.05279063 6.58730228,9.48352022 L6.2100508,10.7249719 C6.0649735,11.2053044 5.62242271,11.5339347 5.12065911,11.5339347 C4.61889551,11.5339347 4.17634472,11.2053044 4.03126742,10.7249719 L3.65669148,9.48352022 C3.52807698,9.05567912 3.08963152,8.80095947 2.65425492,8.90114382 L1.39585813,9.19277794 C0.90628999,9.30312648 0.401952083,9.08158909 0.152017275,8.64640366 C-0.0979175321,8.21121824 -0.035112502,7.66396047 0.306912358,7.29671021 L1.18716582,6.34689264 C1.48864582,6.01922094 1.48864582,5.51516263 1.18716582,5.18749093 L0.306912358,4.23767336 C-0.035112502,3.8704231 -0.0979175321,3.32316533 0.152017275,2.88797991 C0.401952083,2.45279448 0.90628999,2.23125709 1.39585813,2.34160563 L2.65425492,2.63323975 C3.08937078,2.73350334 3.52770594,2.47923776 3.65669148,2.0517552 L4.03483481,0.810303513 C4.17932126,0.32979188 4.62146882,0.000617032116 5.12323309,0 C5.62499736,-0.000615299293 6.06795204,0.327472644 6.21361819,0.80762797 Z"
            id="Path"
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export const ToolMagneticRoi = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-livewire"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <line
        x1="12.5"
        y1="6.5"
        x2="8.5"
        y2="9.5"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      ></line>
      <line
        x1="6.5"
        y1="12.5"
        x2="5.5"
        y2="19.5"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      ></line>
      <g
        id="Group"
        transform="translate(16.998, 17.5912) rotate(45) translate(-16.998, -17.5912)translate(12.496, 13.5)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <line
          x1="0.00327299164"
          y1="2.45474373"
          x2="3.27626463"
          y2="2.45474373"
          id="Path"
        ></line>
        <line
          x1="5.73100836"
          y1="2.45474373"
          x2="9.004"
          y2="2.45474373"
          id="Path"
        ></line>
        <path
          d="M5.72773537,4.09123955 C5.72773537,4.76909831 5.17822227,5.31861141 4.5003635,5.31861141 C3.82250474,5.31861141 3.27299164,4.76909831 3.27299164,4.09123955 L3.27299164,0.81824791 C3.25976214,0.371936739 2.9010549,0.0132295012 2.45474373,-5.11613498e-14 L0.81824791,-5.11613498e-14 C0.371936739,0.0132295012 0.0132295012,0.371936739 0,0.81824791 L0,4.09123955 C0,6.80209487 2.01452635,8.1824791 4.5003635,8.1824791 C6.98620065,8.1824791 9.00072701,6.80209487 9.00072701,4.09123955 L9.00072701,0.81824791 C8.98749751,0.371936739 8.62879027,0.0132295012 8.1824791,-5.11613498e-14 L6.54598328,-5.11613498e-14 C6.09967211,0.0132295012 5.74096487,0.371936739 5.72773537,0.81824791 L5.72773537,4.09123955 Z"
          id="Path"
        ></path>
      </g>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="14.5"
        cy="5.5"
        r="1.5"
      ></circle>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="5.5"
        cy="21.5"
        r="1.5"
      ></circle>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="7"
        cy="10.5"
        r="1.5"
      ></circle>
    </g>
  </svg>
);

export const ToolMagnify = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-zoom-in"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="12.75"
        cy="12.7491667"
        r="8.33333333"
      ></circle>
      <line
        x1="23.5833333"
        y1="23.5825"
        x2="18.6425"
        y2="18.6416667"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="8.58333333"
        y1="12.7491667"
        x2="16.9166667"
        y2="12.7491667"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="12.75"
        y1="8.5825"
        x2="12.75"
        y2="16.9158333"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolMeasureEllipse = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-measure-elipse"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group"
        transform="translate(1.6119, 2.6735)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1="19.8333333"
          y1="14.625"
          x2="19.8333333"
          y2="22.9583333"
          id="Path"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></line>
        <line
          x1="24"
          y1="18.7916667"
          x2="15.6666667"
          y2="18.7916667"
          id="Path"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></line>
        <ellipse
          id="Oval"
          transform="translate(10.5, 7) rotate(89) translate(-10.5, -7)"
          cx="10.5"
          cy="7"
          rx="6.5"
          ry="10"
        ></ellipse>
      </g>
    </g>
  </svg>
);

export const ToolMoreMenu = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 6"
    {...props}
  >
    <g
      fill="none"
      fillRule="evenodd"
    >
      <path
        d="M0 0L29 0 29 29 0 29z"
        transform="translate(-4.5 -11.5)"
      />
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M7.25 12.083c-1.33 0-2.417 1.088-2.417 2.417 0 1.33 1.088 2.417 2.417 2.417 1.33 0 2.417-1.088 2.417-2.417 0-1.33-1.088-2.417-2.417-2.417zm14.5 0c-1.33 0-2.417 1.088-2.417 2.417 0 1.33 1.088 2.417 2.417 2.417 1.33 0 2.417-1.088 2.417-2.417 0-1.33-1.088-2.417-2.417-2.417zm-7.25 0c-1.33 0-2.417 1.088-2.417 2.417 0 1.33 1.088 2.417 2.417 2.417 1.33 0 2.417-1.088 2.417-2.417 0-1.33-1.088-2.417-2.417-2.417z"
        transform="translate(-4.5 -11.5)"
      />
    </g>
  </svg>
);

export const ToolMove = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-move"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <line
        x1="13.8823529"
        y1="22.5294118"
        x2="13.8823529"
        y2="4"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="22.5294118"
        y1="13.8823529"
        x2="5.23529412"
        y2="13.8823529"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <polyline
        id="Path-28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="11.4117647 6.46832349 13.8800882 4 16.3642969 6.48420875"
      ></polyline>
      <polyline
        id="Path-28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(13.888, 22.5362) rotate(-180) translate(-13.888, -22.5362)"
        points="11.4117647 23.7624411 13.8800882 21.2941176 16.3642969 23.7783264"
      ></polyline>
      <polyline
        id="Path-28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(5.2421, 13.888) rotate(-90) translate(-5.2421, -13.888)"
        points="2.76583826 15.1142499 5.23416174 12.6459264 7.71837049 15.1301352"
      ></polyline>
      <polyline
        id="Path-28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(22.5362, 13.888) rotate(-270) translate(-22.5362, -13.888)"
        points="20.0599559 15.1142499 22.5282794 12.6459264 25.0124881 15.1301352"
      ></polyline>
    </g>
  </svg>
);

export const ToolPolygon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 50 50"
    {...props}
  >
    <polygon
      points="24 1, 46 18, 40 49, 9 49, 1 18"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

export const ToolQuickMagnify = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-zoom-in"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="12.75"
        cy="12.7491667"
        r="8.33333333"
      ></circle>
      <line
        x1="23.5833333"
        y1="23.5825"
        x2="18.6425"
        y2="18.6416667"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="8.58333333"
        y1="12.7491667"
        x2="16.9166667"
        y2="12.7491667"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="12.75"
        y1="8.5825"
        x2="12.75"
        y2="16.9158333"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolRectangle = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-rectangle"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group-8"
        transform="translate(15.8182, 15.5)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.65"
      >
        <line
          x1="3.78787879"
          y1="1.69561335e-14"
          x2="3.78787879"
          y2="7.57575758"
          id="Path"
        ></line>
        <line
          x1="7.57575758"
          y1="3.78787879"
          x2="-1.37263938e-13"
          y2="3.78787879"
          id="Path"
        ></line>
      </g>
      <path
        d="M12.030303,19.2878788 L6,19.2878788 C4.8954305,19.2878788 4,18.3924483 4,17.2878788 L4,7.5 C4,6.3954305 4.8954305,5.5 6,5.5 L19.8924006,5.5 C20.9969701,5.5 21.8924006,6.3954305 21.8924006,7.5 L21.8924006,12.0059038 L21.8924006,12.0059038"
        id="Path-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </g>
  </svg>
);

export const ToolReferenceLines = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-reference-lines"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <path
        d="M5.75,14.75 L7.75,14.75 C8.16421356,14.75 8.5,14.4142136 8.5,14 C8.5,13.5857864 8.16421356,13.25 7.75,13.25 L5.75,13.25 C5.33578644,13.25 5,13.5857864 5,14 C5,14.4142136 5.33578644,14.75 5.75,14.75 Z"
        id="Path"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
      <path
        d="M10.75,14.75 L12.75,14.75 C13.1642136,14.75 13.5,14.4142136 13.5,14 C13.5,13.5857864 13.1642136,13.25 12.75,13.25 L10.75,13.25 C10.3357864,13.25 10,13.5857864 10,14 C10,14.4142136 10.3357864,14.75 10.75,14.75 Z"
        id="Path"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
      <path
        d="M15.75,14.75 L17.75,14.75 C18.1642136,14.75 18.5,14.4142136 18.5,14 C18.5,13.5857864 18.1642136,13.25 17.75,13.25 L15.75,13.25 C15.3357864,13.25 15,13.5857864 15,14 C15,14.4142136 15.3357864,14.75 15.75,14.75 Z"
        id="Path"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
      <path
        d="M20.75,14.75 L22.75,14.75 C23.1642136,14.75 23.5,14.4142136 23.5,14 C23.5,13.5857864 23.1642136,13.25 22.75,13.25 L20.75,13.25 C20.3357864,13.25 20,13.5857864 20,14 C20,14.4142136 20.3357864,14.75 20.75,14.75 Z"
        id="Path"
        fill="currentColor"
        fillRule="nonzero"
      ></path>
      <path
        d="M6.25,10 L6.25,7 C6.25,6.44771525 6.69771525,6 7.25,6 L12.9765472,6 L12.9765472,6 L21.25,6 C21.8022847,6 22.25,6.44771525 22.25,7 L22.25,10 L22.25,10"
        id="Path-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M6.25,22.426395 L6.25,19.426395 C6.25,18.8741103 6.69771525,18.426395 7.25,18.426395 L21.25,18.426395 C21.8022847,18.426395 22.25,18.8741103 22.25,19.426395 L22.25,22.426395 L22.25,22.426395"
        id="Path-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        transform="translate(14.25, 20.4264) scale(1, -1) translate(-14.25, -20.4264)"
      ></path>
    </g>
  </svg>
);

export const ToolProbe = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      fill="none"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      transform="translate(4 4)"
    >
      <path d="M10 0L10 3.333M10 16.667L10 20M0 10L3.333 10M16.667 10L20 10" />
      <circle
        cx="10"
        cy="10"
        r="6.667"
      />
      <path d="M10 9.583c.23 0 .417.187.417.417 0 .23-.187.417-.417.417-.23 0-.417-.187-.417-.417 0-.23.187-.417.417-.417" />
    </g>
  </svg>
);

export const ToolReset = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-reset"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <polyline
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="15.7879373 10.9230769 22.7110142 10.9230769 22.7110142 4"
      ></polyline>
      <path
        d="M22.1848604,10.9230769 C20.7833124,6.95640473 16.8769835,4.43920288 12.6856477,4.80187309 C8.49431195,5.16454329 5.07842549,8.3153258 4.37906817,12.4637863 C3.67971085,16.6122468 5.8738281,20.708777 9.71461129,22.4255209 C13.5553945,24.1422648 18.0710813,23.0448664 20.6956296,19.7569231"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export const ToolRotateRight = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-rotate-right"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <rect
        id="Rectangle"
        fill="currentColor"
        x="9.55555556"
        y="13"
        width="14.4444444"
        height="11.1111111"
        rx="2"
      ></rect>
      <g
        id="Group-11"
        transform="translate(4, 3)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path
          d="M8.88888889,3.33333333 L4.44444444,3.33333333 C1.98984556,3.33333333 0,5.32317889 0,7.77777778 L0,12.2222222"
          id="Path"
        ></path>
        <polyline
          id="Path"
          points="5.55555556 0 8.88888889 3.33333333 5.55555556 6.66666667"
        ></polyline>
      </g>
    </g>
  </svg>
);

export const ToolSegBrush = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-brush"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <path
        d="M3.24640621,21.8286833 C3.09173375,21.7551472 2.99513748,21.5971513 3.00018895,21.4259625 C3.00524042,21.2547737 3.11098486,21.1027485 3.26972426,21.0384606 C5.3260304,20.2059201 4.66362518,17.8620247 5.27421252,16.6088957 C6.02197747,15.1026514 7.84114758,14.4766383 9.35746132,15.2037675 C13.9485253,17.4422999 8.48346644,24.3211232 3.24640621,21.8286833 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M21.5968442,2.302022 C21.1256527,1.8826075 20.4094461,1.90228142 19.9619901,2.34693083 L9.69255027,12.5887345 C11.0536437,13.0051578 12.1843437,13.9616637 12.8206229,15.2349008 L21.7410706,3.93687606 C22.1347378,3.44008272 22.0714081,2.72222021 21.5968442,2.302022 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export const ToolSegEraser = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-eraser"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <path
        d="M8.47826087,18.0030772 C7.48731947,17.9495317 6.54439458,17.5591084 5.80565217,16.8964685 L4.1066087,15.1958598 C3.49763625,14.5834856 3.49763625,13.5942339 4.1066087,12.9818598 L13.6317391,3.45672934 C14.2441133,2.84775689 15.233365,2.84775689 15.8457391,3.45672934 L19.8926087,7.5035989 C20.5015811,8.11597307 20.5015811,9.10522473 19.8926087,9.7175989 L12.7153043,16.8949033 C11.9769855,17.5579476 11.0343414,17.9489213 10.0434783,18.0030772 L8.47826087,18.0030772 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <line
        x1="10.0434783"
        y1="7.04499021"
        x2="16.3043478"
        y2="13.3058598"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="3"
        y1="20.5667293"
        x2="21"
        y2="20.5667293"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolSegShape = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-seg-shape"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        cx="16"
        cy="15"
        r="6"
      ></circle>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.5"
        x="3"
        y="3"
        width="13"
        height="13"
        rx="2"
      ></rect>
    </g>
  </svg>
);

export const ToolSegThreshold = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-threshold"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <g
        id="Group"
        transform="translate(2.4184, 14.3673)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1="16.5816327"
          y1="2.13265306"
          x2="19.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <line
          x1="0.0816326531"
          y1="2.13265306"
          x2="12.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <circle
          id="Oval"
          cx="14.2244898"
          cy="2.09183673"
          r="2.09183673"
        ></circle>
      </g>
      <g
        id="Group"
        transform="translate(11.7092, 7.4592) scale(-1, 1) translate(-11.7092, -7.4592)translate(1.9184, 5.3673)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1="16"
          y1="2.13265306"
          x2="19.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <line
          x1="0.0816326531"
          y1="2.13265306"
          x2="11"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <circle
          id="Oval"
          cx="13.2244898"
          cy="2.09183673"
          r="2.09183673"
        ></circle>
      </g>
    </g>
  </svg>
);

export const ToolSplineRoi = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-spline-roi"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <g
        id="Group-3"
        transform="translate(5, 5)"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path
          d="M5,4 C6.80276265,2.42407491 9.10583462,1.538278 11.5,1.5 L15.5,1.5"
          id="Path"
        ></path>
        <path
          d="M1.5,15.5 L1.5,11.5 C1.50313857,9.33936854 2.19845937,7.23658385 3.484,5.5"
          id="Path"
        ></path>
        <circle
          id="Oval"
          strokeLinecap="round"
          cx="4"
          cy="4.5"
          r="1.5"
        ></circle>
        <circle
          id="Oval"
          strokeLinecap="round"
          cx="17.5"
          cy="1.5"
          r="1.5"
        ></circle>
        <circle
          id="Oval"
          strokeLinecap="round"
          cx="1.5"
          cy="17.5"
          r="1.5"
        ></circle>
      </g>
    </g>
  </svg>
);

export const ToolStackImageSync = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-stack-image-sync"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <path
        d="M16.4346891,14.4875228 L16.5216447,14.5744783 C17.2833202,15.336115 18.5181991,15.336115 19.2798746,14.5744783 L23.1459183,10.7049564 C24.2824086,9.55997894 24.2824086,7.71258895 23.1459183,6.56761146 L21.4311549,4.85371762 C20.2872588,3.71542746 18.4385755,3.71542746 17.2946795,4.85371762 L13.4277663,8.71976127 C12.6661296,9.48143685 12.6661296,10.7163157 13.4277663,11.4779913 L13.5147218,11.5649468"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M11.5651784,13.5118815 L11.4782229,13.424926 C10.7165473,12.6632893 9.48166848,12.6632893 8.7199929,13.424926 L4.85307969,17.2944478 C3.7156401,18.439034 3.7156401,20.2872066 4.85307969,21.4317928 L6.56697354,23.1456867 C7.71077373,24.2850306 9.56051831,24.2850306 10.7043185,23.1456867 L14.5703622,19.279643 C14.9365407,18.9140991 15.1423111,18.4179341 15.1423111,17.900528 C15.1423111,17.3831219 14.9365407,16.8869569 14.5703622,16.521413 L14.4834066,16.4344575"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <line
        x1="10.2069328"
        y1="17.7927031"
        x2="17.7911957"
        y2="10.2067011"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolStackScroll = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-stack-scroll"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.5"
        x="4"
        y="9.71428571"
        width="14.2857143"
        height="14.2857143"
        rx="2"
      ></rect>
      <path
        d="M7.0094401,6.85714286 L18.9906762,6.85714286 C20.0952457,6.85714286 20.9906762,7.75257336 20.9906762,8.85714286 L20.9906762,21.1428571 L20.9906762,21.1428571"
        id="Path-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M9.71428571,4 L21.6955218,4 C22.8000913,4 23.6955218,4.8954305 23.6955218,6 L23.6955218,18.2857143 L23.6955218,18.2857143"
        id="Path-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </g>
  </svg>
);

export const ToolToggleDicomOverlay = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-toggle-dicom-overlay"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <path
        d="M21.5629346,19 C21.9081126,19 22.1879346,19.279822 22.1879346,19.625 C22.1879346,19.970178 21.9081126,20.25 21.5629346,20.25 L20.2129346,20.25 C19.8677566,20.25 19.5879346,19.970178 19.5879346,19.625 C19.5879346,19.279822 19.8677566,19 20.2129346,19 L21.5629346,19 Z M17.4829346,19 C17.8281125,19 18.1079346,19.279822 18.1079346,19.625 C18.1079346,19.970178 17.8281125,20.25 17.4829346,20.25 L16.1329346,20.25 C15.7877566,20.25 15.5079346,19.970178 15.5079346,19.625 C15.5079346,19.279822 15.7877566,19 16.1329346,19 L17.4829346,19 Z M13.4029345,19 C13.7481125,19 14.0279345,19.279822 14.0279345,19.625 C14.0279345,19.970178 13.7481125,20.25 13.4029345,20.25 L12.0529345,20.25 C11.7077565,20.25 11.4279345,19.970178 11.4279345,19.625 C11.4279345,19.279822 11.7077565,19 12.0529345,19 L13.4029345,19 Z M8.98988002,17.034041 C9.33501017,17.0282959 9.61945075,17.3034219 9.62519584,17.648552 C9.63057519,17.9717108 9.74731641,18.2750986 9.95299373,18.5163531 C10.1769336,18.7790292 10.1455318,19.1735095 9.88285564,19.3974494 C9.62017952,19.6213893 9.22569928,19.5899874 9.00175936,19.3273113 C8.60957687,18.8672907 8.38562164,18.2852745 8.37536899,17.6693568 C8.3696239,17.3242267 8.64474986,17.0397861 8.98988002,17.034041 Z M24,16.4185328 C24.345178,16.4185328 24.625,16.6983548 24.625,17.0435328 L24.625,17.625 C24.625,17.9681799 24.5587904,18.303203 24.431654,18.6151793 C24.3013887,18.9348335 23.936657,19.0883635 23.6170028,18.9580982 C23.2973486,18.8278329 23.1438186,18.4631012 23.2740839,18.143447 C23.3404391,17.9806197 23.375,17.8057405 23.375,17.625 L23.375,17.0435328 C23.375,16.6983548 23.654822,16.4185328 24,16.4185328 Z M9,12.9544019 C9.34517797,12.9544019 9.625,13.2342239 9.625,13.5794019 L9.625,14.9294019 C9.625,15.2745799 9.34517797,15.5544019 9,15.5544019 C8.65482203,15.5544019 8.375,15.2745799 8.375,14.9294019 L8.375,13.5794019 C8.375,13.2342239 8.65482203,12.9544019 9,12.9544019 Z M24,12.3385328 C24.345178,12.3385328 24.625,12.6183548 24.625,12.9635328 L24.625,14.3135328 C24.625,14.6587107 24.345178,14.9385328 24,14.9385328 C23.654822,14.9385328 23.375,14.6587107 23.375,14.3135328 L23.375,12.9635328 C23.375,12.6183548 23.654822,12.3385328 24,12.3385328 Z M9,8.87440184 C9.34517797,8.87440184 9.625,9.15422387 9.625,9.49940184 L9.625,10.8494019 C9.625,11.1945798 9.34517797,11.4744019 9,11.4744019 C8.65482203,11.4744019 8.375,11.1945798 8.375,10.8494019 L8.375,9.49940184 C8.375,9.15422387 8.65482203,8.87440184 9,8.87440184 Z M24,8.25853271 C24.345178,8.25853271 24.625,8.53835474 24.625,8.88353271 L24.625,10.2335327 C24.625,10.5787107 24.345178,10.8585327 24,10.8585327 C23.654822,10.8585327 23.375,10.5787107 23.375,10.2335327 L23.375,8.88353271 C23.375,8.53835474 23.654822,8.25853271 24,8.25853271 Z M8.85203131,5.11578232 C9.05066164,4.83348137 9.44053346,4.76565293 9.72283441,4.96428326 C10.0051354,5.16291358 10.0729638,5.55278541 9.87433347,5.83508635 C9.71277357,6.06470142 9.625,6.33744835 9.625,6.625 L9.625,6.76940182 C9.625,7.11457979 9.34517797,7.39440182 9,7.39440182 C8.65482203,7.39440182 8.375,7.11457979 8.375,6.76940182 L8.375,6.625 C8.375,6.07783578 8.54347711,5.55431124 8.85203131,5.11578232 Z M22.6742845,4.64042222 C22.8779596,4.36173907 23.2689882,4.30093301 23.5476713,4.50460808 C24.037257,4.86242093 24.3909544,5.3800285 24.5426114,5.97056314 C24.6284714,6.30489214 24.4270475,6.64552267 24.0927185,6.73138272 C23.7583895,6.81724277 23.417759,6.61581889 23.331899,6.28148989 C23.2527262,5.9732005 23.0672181,5.70172435 22.8100986,5.51380903 C22.5314155,5.31013396 22.4706094,4.91910536 22.6742845,4.64042222 Z M12.35,4 C12.695178,4 12.975,4.27982203 12.975,4.625 C12.975,4.97017797 12.695178,5.25 12.35,5.25 L11,5.25 C10.654822,5.25 10.375,4.97017797 10.375,4.625 C10.375,4.27982203 10.654822,4 11,4 L12.35,4 Z M16.4300001,4 C16.775178,4 17.0550001,4.27982203 17.0550001,4.625 C17.0550001,4.97017797 16.775178,5.25 16.4300001,5.25 L15.08,5.25 C14.7348221,5.25 14.455,4.97017797 14.455,4.625 C14.455,4.27982203 14.7348221,4 15.08,4 L16.4300001,4 Z M20.5100001,4 C20.8551781,4 21.1350001,4.27982203 21.1350001,4.625 C21.1350001,4.97017797 20.8551781,5.25 20.5100001,5.25 L19.1600001,5.25 C18.8148221,5.25 18.5350001,4.97017797 18.5350001,4.625 C18.5350001,4.27982203 18.8148221,4 19.1600001,4 L20.5100001,4 Z"
        id="Rectangle"
        fill="currentColor"
        fillRule="nonzero"
        transform="translate(16.5, 12.125) rotate(180) translate(-16.5, -12.125)"
      ></path>
      <path
        d="M6.1678365,9.125 L5.5,9.125 C4.3954305,9.125 3.5,10.0204305 3.5,11.125 L3.5,22.125 C3.5,23.2295695 4.3954305,24.125 5.5,24.125 L16.5,24.125 C17.6045695,24.125 18.5,23.2295695 18.5,22.125 L18.5,21.9543874 L18.5,21.9543874"
        id="Path-9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      ></path>
    </g>
  </svg>
);

export const ToolUltrasoundBidirectional = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-ultrasound-bidirectional"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <line
        x1="4"
        y1="17.5"
        x2="4"
        y2="23.5"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      ></line>
      <line
        x1="7.5"
        y1="20.5"
        x2="7.5"
        y2="26.5"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        transform="translate(7.5, 23.5) rotate(-90) translate(-7.5, -23.5)"
      ></line>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="4"
        cy="15.5"
        r="1.5"
      ></circle>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="12.5"
        cy="23.5"
        r="1.5"
      ></circle>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.5"
        x="8"
        y="4"
        width="17"
        height="10"
        rx="2"
      ></rect>
      <g
        id="US"
        transform="translate(11.6055, 6.5586)"
        fill="currentColor"
        fillRule="nonzero"
      >
        <path
          d="M2.15625,4.61328125 C1.49609375,4.61328125 1.05859375,4.21875 1.05859375,3.4921875 L1.05859375,0.109375 L0,0.109375 L0,3.6015625 C0,4.76953125 0.84375,5.54296875 2.15625,5.54296875 C3.46484375,5.54296875 4.30859375,4.76953125 4.30859375,3.6015625 L4.30859375,0.109375 L3.25,0.109375 L3.25,3.4921875 C3.25,4.21484375 2.8125,4.61328125 2.15625,4.61328125 Z"
          id="Path"
        ></path>
        <path
          d="M5.25390625,3.97265625 C5.30078125,4.81640625 5.95703125,5.54296875 7.3125,5.54296875 C8.6640625,5.54296875 9.42578125,4.859375 9.42578125,3.859375 C9.42578125,2.953125 8.85546875,2.5390625 7.9921875,2.34765625 L7.1640625,2.1640625 C6.6953125,2.06640625 6.43359375,1.86328125 6.43359375,1.546875 C6.43359375,1.1484375 6.78125,0.85546875 7.36328125,0.85546875 C7.9296875,0.85546875 8.27734375,1.1484375 8.34375,1.51953125 L9.34375,1.51953125 C9.29296875,0.6953125 8.58984375,0 7.37109375,0 C6.1953125,0 5.37890625,0.63671875 5.37890625,1.625 C5.37890625,2.44921875 5.90234375,2.91796875 6.73046875,3.10546875 L7.5546875,3.29296875 C8.109375,3.41796875 8.375,3.6015625 8.375,3.96484375 C8.375,4.38671875 8.02734375,4.6796875 7.37109375,4.6796875 C6.7421875,4.6796875 6.34375,4.375 6.2734375,3.97265625 L5.25390625,3.97265625 Z"
          id="Path"
        ></path>
      </g>
    </g>
  </svg>
);

export const ToolWindowLevel = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-window-level"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <circle
        id="Oval-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="14"
        cy="14"
        r="10"
      ></circle>
      <path
        d="M21.4837076,7.36702528 C23.0493155,9.13213184 24,11.4550438 24,14 C24,19.5228475 19.5228475,24 14,24 C11.4550438,24 9.13213184,23.0493155 7.36702528,21.4837076 Z"
        id="Combined-Shape"
        fill="currentColor"
      ></path>
    </g>
  </svg>
);

export const ToolWindowRegion = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      id="tool-window-region"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <path
        d="M10.3460449,22 L4,22 C3.44771525,22 3,21.5522847 3,21 L3,4 C3,3.44771525 3.44771525,3 4,3 L21,3 C21.5522847,3 22,3.44771525 22,4 L22,11.3197021"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <g
        id="Group"
        transform="translate(14, 15)"
        fill="currentColor"
      >
        <path
          d="M5.5,-0.75 C8.95177969,-0.75 11.75,2.04822031 11.75,5.5 C11.75,8.95177969 8.95177969,11.75 5.5,11.75 C2.04822031,11.75 -0.75,8.95177969 -0.75,5.5 C-0.75,2.04822031 2.04822031,-0.75 5.5,-0.75 Z M5.5,0.75 C2.87664744,0.75 0.75,2.87664744 0.75,5.5 C0.75,8.12335256 2.87664744,10.25 5.5,10.25 C8.12335256,10.25 10.25,8.12335256 10.25,5.5 C10.25,2.87664744 8.12335256,0.75 5.5,0.75 Z"
          id="Oval"
          fillRule="nonzero"
        ></path>
        <path
          d="M9.61552427,1.85128344 C10.4769151,2.82216322 11,4.09999509 11,5.5 C11,8.53756612 8.53756612,11 5.5,11 C4.09999509,11 2.82216322,10.4769151 1.85128344,9.61552427 Z"
          id="Combined-Shape"
        ></path>
      </g>
    </g>
  </svg>
);

export const ToolZoom = (props: IconProps) => (
  <svg
    width="28px"
    height="28px"
    viewBox="0 0 28 28"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      id="tool-zoom"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="28"
        height="28"
      ></rect>
      <ellipse
        id="Oval-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="11.5581395"
        cy="12.0909091"
        rx="7.81395349"
        ry="7.63636364"
      ></ellipse>
      <line
        x1="17.4186047"
        y1="17.8181818"
        x2="23.2790698"
        y2="23.5454545"
        id="Line"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolBrush = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-brush"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <path
        d="M3.24640621,21.8286833 C3.09173375,21.7551472 2.99513748,21.5971513 3.00018895,21.4259625 C3.00524042,21.2547737 3.11098486,21.1027485 3.26972426,21.0384606 C5.3260304,20.2059201 4.66362518,17.8620247 5.27421252,16.6088957 C6.02197747,15.1026514 7.84114758,14.4766383 9.35746132,15.2037675 C13.9485253,17.4422999 8.48346644,24.3211232 3.24640621,21.8286833 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M21.5968442,2.302022 C21.1256527,1.8826075 20.4094461,1.90228142 19.9619901,2.34693083 L9.69255027,12.5887345 C11.0536437,13.0051578 12.1843437,13.9616637 12.8206229,15.2349008 L21.7410706,3.93687606 C22.1347378,3.44008272 22.0714081,2.72222021 21.5968442,2.302022 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </g>
  </svg>
);

export const ToolEraser = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-eraser"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <path
        d="M8.47826087,18.0030772 C7.48731947,17.9495317 6.54439458,17.5591084 5.80565217,16.8964685 L4.1066087,15.1958598 C3.49763625,14.5834856 3.49763625,13.5942339 4.1066087,12.9818598 L13.6317391,3.45672934 C14.2441133,2.84775689 15.233365,2.84775689 15.8457391,3.45672934 L19.8926087,7.5035989 C20.5015811,8.11597307 20.5015811,9.10522473 19.8926087,9.7175989 L12.7153043,16.8949033 C11.9769855,17.5579476 11.0343414,17.9489213 10.0434783,18.0030772 L8.47826087,18.0030772 Z"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <line
        x1="10.0434783"
        y1="7.04499021"
        x2="16.3043478"
        y2="13.3058598"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
      <line
        x1="3"
        y1="20.5667293"
        x2="21"
        y2="20.5667293"
        id="Path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></line>
    </g>
  </svg>
);

export const ToolThreshold = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-threshold"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <g
        id="Group"
        transform="translate(2.4184, 14.3673)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1="16.5816327"
          y1="2.13265306"
          x2="19.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <line
          x1="0.0816326531"
          y1="2.13265306"
          x2="12.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <circle
          id="Oval"
          cx="14.2244898"
          cy="2.09183673"
          r="2.09183673"
        ></circle>
      </g>
      <g
        id="Group"
        transform="translate(11.7092, 7.4592) scale(-1, 1) translate(-11.7092, -7.4592)translate(1.9184, 5.3673)"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <line
          x1="16"
          y1="2.13265306"
          x2="19.0816327"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <line
          x1="0.0816326531"
          y1="2.13265306"
          x2="11"
          y2="2.13265306"
          id="Line-2"
          strokeLinecap="round"
        ></line>
        <circle
          id="Oval"
          cx="13.2244898"
          cy="2.09183673"
          r="2.09183673"
        ></circle>
      </g>
    </g>
  </svg>
);

export const ToolShape = (props: IconProps) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      id="tool-seg-shape"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <rect
        id="Rectangle"
        x="0"
        y="0"
        width="24"
        height="24"
      ></rect>
      <circle
        id="Oval"
        stroke="currentColor"
        strokeWidth="1.5"
        cx="16"
        cy="15"
        r="6"
      ></circle>
      <rect
        id="Rectangle"
        stroke="currentColor"
        strokeWidth="1.5"
        x="3"
        y="3"
        width="13"
        height="13"
        rx="2"
      ></rect>
    </g>
  </svg>
);
export const ToolLabelmapAssist = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M15.896 11.3736L17.2416 8.6832L21.55 7.07903C21.9997 6.89305 22.3572 6.53602 22.5437 6.08648C22.7302 5.63693 22.7305 5.13171 22.5445 4.68195C22.3586 4.23219 22.0015 3.87473 21.552 3.6882C21.1025 3.50168 20.5972 3.50138 20.1475 3.68737L7.61663 9.14153L5.0573 7.8582C4.99771 7.82826 4.93231 7.81168 4.86566 7.80962C4.799 7.80756 4.7327 7.82007 4.67138 7.84628L2.27797 8.87295C2.20912 8.90242 2.14854 8.94832 2.10153 9.00662C2.05452 9.06493 2.02251 9.13386 2.00831 9.2074C1.99411 9.28093 1.99815 9.35683 2.02007 9.42844C2.04199 9.50006 2.08112 9.56521 2.13405 9.6182L5.56697 13.0511C5.63034 13.1145 5.71093 13.158 5.79875 13.1761C5.88657 13.1942 5.97777 13.1861 6.06105 13.1529L12.6583 10.5165"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.0279 5.48134L10.0971 3.03476C9.98496 2.98841 9.85903 2.98841 9.74691 3.03476L7.557 3.94318C7.47321 3.97785 7.4016 4.03659 7.35121 4.11198C7.30082 4.18736 7.27393 4.276 7.27393 4.36668C7.27393 4.45735 7.30082 4.54599 7.35121 4.62137C7.4016 4.69676 7.47321 4.7555 7.557 4.79018L12.7123 6.92326"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.0447 16.2917C18.0447 16.0585 17.9116 15.9187 17.6456 15.872C17.0203 15.7721 16.5315 15.6789 16.1789 15.5923C15.8264 15.4991 15.567 15.3658 15.4007 15.1927C15.2277 15.0195 15.1047 14.7664 15.0315 14.4334C14.9517 14.0937 14.8752 13.6241 14.802 13.0246C14.7821 12.9047 14.7355 12.8082 14.6624 12.7349C14.5825 12.6616 14.4894 12.625 14.383 12.625C14.2766 12.625 14.1835 12.6616 14.1036 12.7349C14.0238 12.8015 13.9739 12.8914 13.954 13.0047C13.8742 13.6174 13.7943 14.0903 13.7145 14.4234C13.628 14.7564 13.4983 15.0062 13.3254 15.1727C13.1458 15.3392 12.8831 15.4691 12.5372 15.5623C12.1847 15.6489 11.6991 15.7522 11.0805 15.872C10.9674 15.892 10.8776 15.942 10.8111 16.0219C10.7446 16.1018 10.7113 16.1918 10.7113 16.2917C10.7113 16.3982 10.7479 16.4915 10.8211 16.5714C10.8876 16.6447 10.9774 16.6913 11.0905 16.7113C11.6958 16.7979 12.1747 16.8811 12.5272 16.9611C12.8731 17.0343 13.1358 17.1575 13.3154 17.3307C13.495 17.4972 13.628 17.7537 13.7145 18.1C13.7943 18.453 13.8742 18.9426 13.954 19.5687C13.9739 19.6819 14.0238 19.7752 14.1036 19.8484C14.1768 19.9217 14.2699 19.9583 14.383 19.9583C14.4894 19.9583 14.5825 19.9184 14.6624 19.8384C14.7355 19.7652 14.7821 19.6719 14.802 19.5587C14.8752 18.9592 14.9517 18.493 15.0315 18.16C15.1047 17.8269 15.2277 17.5772 15.4007 17.4106C15.5736 17.2441 15.8397 17.1176 16.1989 17.031C16.5514 16.9377 17.0469 16.8312 17.6855 16.7113C17.7919 16.6913 17.8784 16.6413 17.9449 16.5614C18.0114 16.4815 18.0447 16.3916 18.0447 16.2917Z"
      fill="currentColor"
    />
    <path
      d="M12.5447 20.4167C12.5447 20.271 12.4615 20.1835 12.2952 20.1544C11.9045 20.092 11.5989 20.0337 11.3786 19.9796C11.1582 19.9213 10.9961 19.838 10.8922 19.7298C10.7841 19.6216 10.7072 19.4634 10.6615 19.2552C10.6116 19.0429 10.5638 18.7494 10.518 18.3748C10.5056 18.2998 10.4765 18.2395 10.4307 18.1937C10.3808 18.1479 10.3226 18.125 10.2561 18.125C10.1896 18.125 10.1314 18.1479 10.0815 18.1937C10.0316 18.2353 10.0005 18.2915 9.98799 18.3623C9.9381 18.7453 9.88822 19.0408 9.83833 19.249C9.78428 19.4571 9.70322 19.6132 9.59513 19.7173C9.48289 19.8214 9.31868 19.9026 9.1025 19.9608C8.88217 20.0149 8.57869 20.0795 8.19207 20.1544C8.1214 20.1669 8.06528 20.1981 8.0237 20.2481C7.98213 20.298 7.96134 20.3542 7.96134 20.4167C7.96134 20.4833 7.98421 20.5416 8.02994 20.5915C8.07151 20.6373 8.12763 20.6664 8.19831 20.6789C8.57661 20.733 8.87593 20.7851 9.09627 20.835C9.31244 20.8808 9.47665 20.9578 9.5889 21.0661C9.70114 21.1701 9.78428 21.3304 9.83833 21.5469C9.88822 21.7675 9.9381 22.0735 9.98799 22.4648C10.0005 22.5356 10.0316 22.5939 10.0815 22.6396C10.1273 22.6854 10.1855 22.7083 10.2561 22.7083C10.3226 22.7083 10.3808 22.6834 10.4307 22.6334C10.4765 22.5876 10.5056 22.5293 10.518 22.4586C10.5638 22.0839 10.6116 21.7925 10.6615 21.5844C10.7072 21.3762 10.7841 21.2201 10.8922 21.116C11.0003 21.012 11.1666 20.9329 11.391 20.8787C11.6114 20.8205 11.9211 20.7539 12.3202 20.6789C12.3867 20.6664 12.4407 20.6352 12.4823 20.5853C12.5239 20.5353 12.5447 20.4791 12.5447 20.4167Z"
      fill="currentColor"
    />
  </svg>
);
export const ToolSegmentAnything = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M12.5566 8.9332C12.5566 8.76203 12.459 8.65932 12.2636 8.62508C11.8045 8.55172 11.4455 8.48325 11.1867 8.41967C10.9278 8.3512 10.7373 8.25339 10.6152 8.12623C10.4882 7.99907 10.3979 7.81322 10.3441 7.56868C10.2855 7.31925 10.2294 6.97446 10.1756 6.53429C10.161 6.44626 10.1268 6.37534 10.0731 6.32154C10.0145 6.26774 9.94609 6.24084 9.86795 6.24084C9.7898 6.24084 9.72142 6.26774 9.66282 6.32154C9.60421 6.37045 9.56758 6.43647 9.55292 6.51962C9.49431 6.96957 9.4357 7.31681 9.3771 7.56135C9.3136 7.80588 9.21836 7.98929 9.09138 8.11156C8.95951 8.23382 8.76658 8.32919 8.51261 8.39766C8.25375 8.46124 7.89722 8.53705 7.44299 8.62508C7.35996 8.63976 7.29403 8.67644 7.24519 8.73513C7.19635 8.79381 7.17193 8.85984 7.17193 8.9332C7.17193 9.01145 7.19879 9.07992 7.25251 9.13861C7.30136 9.19241 7.36729 9.22665 7.45032 9.24132C7.89477 9.3049 8.24643 9.36603 8.50528 9.42472C8.75926 9.47852 8.95218 9.569 9.08405 9.69616C9.21592 9.81843 9.3136 10.0067 9.3771 10.261C9.4357 10.5202 9.49431 10.8797 9.55292 11.3394C9.56758 11.4226 9.60421 11.4911 9.66282 11.5449C9.71654 11.5987 9.78492 11.6256 9.86795 11.6256C9.94609 11.6256 10.0145 11.5962 10.0731 11.5375C10.1268 11.4837 10.161 11.4153 10.1756 11.3321C10.2294 10.8919 10.2855 10.5496 10.3441 10.3051C10.3979 10.0605 10.4882 9.87712 10.6152 9.75485C10.7422 9.63258 10.9376 9.53965 11.2013 9.47607C11.4602 9.4076 11.824 9.32935 12.2929 9.24132C12.371 9.22665 12.4345 9.18997 12.4834 9.13128C12.5322 9.07259 12.5566 9.00656 12.5566 8.9332Z"
      fill="currentColor"
    />
    <path
      d="M17.9415 13.8691C17.9415 13.6123 17.7949 13.4583 17.5019 13.4069C16.8132 13.2969 16.2748 13.1942 15.8865 13.0988C15.4982 12.9961 15.2125 12.8494 15.0293 12.6586C14.8388 12.4679 14.7033 12.1891 14.6227 11.8223C14.5348 11.4482 14.4506 10.931 14.37 10.2707C14.348 10.1387 14.2967 10.0323 14.2161 9.95161C14.1282 9.87092 14.0256 9.83057 13.9084 9.83057C13.7912 9.83057 13.6886 9.87092 13.6007 9.95161C13.5128 10.025 13.4579 10.124 13.4359 10.2487C13.348 10.9236 13.2601 11.4445 13.1722 11.8113C13.0769 12.1781 12.9341 12.4532 12.7436 12.6366C12.5458 12.82 12.2564 12.9631 11.8754 13.0658C11.4871 13.1612 10.9523 13.2749 10.271 13.4069C10.1465 13.4289 10.0476 13.484 9.97429 13.572C9.90103 13.66 9.8644 13.7591 9.8644 13.8691C9.8644 13.9865 9.90469 14.0892 9.98528 14.1772C10.0585 14.2579 10.1574 14.3093 10.282 14.3313C10.9487 14.4266 11.4761 14.5183 11.8644 14.6064C12.2454 14.6871 12.5348 14.8228 12.7326 15.0135C12.9304 15.1969 13.0769 15.4794 13.1722 15.8609C13.2601 16.2497 13.348 16.7889 13.4359 17.4785C13.4579 17.6032 13.5128 17.7059 13.6007 17.7866C13.6813 17.8673 13.7839 17.9076 13.9084 17.9076C14.0256 17.9076 14.1282 17.8636 14.2161 17.7756C14.2967 17.6949 14.348 17.5922 14.37 17.4675C14.4506 16.8072 14.5348 16.2937 14.6227 15.9269C14.7033 15.5601 14.8388 15.285 15.0293 15.1016C15.2198 14.9182 15.5129 14.7788 15.9085 14.6834C16.2967 14.5807 16.8425 14.4633 17.5459 14.3313C17.6631 14.3093 17.7583 14.2542 17.8316 14.1662C17.9048 14.0782 17.9415 13.9791 17.9415 13.8691Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.3823 17.7373C19.0569 16.1757 20.044 14.1881 20.3223 12.1916C20.656 9.79757 20.2606 7.22773 18.7177 5.57321C17.0356 3.76929 14.2662 3.24208 11.6462 3.60868C9.83542 3.86207 8.02625 4.68764 6.52164 6.09072C4.92546 7.57918 3.9538 9.4548 3.62536 11.3563C3.21073 13.7569 3.82082 16.1818 5.47407 17.9547C7.20202 19.8077 9.72139 20.5742 12.2577 20.2193C14.0685 19.9659 15.8777 19.1403 17.3823 17.7373ZM21.8079 12.3987C21.4817 14.7386 20.3299 17.0396 18.4053 18.8343C16.6759 20.447 14.5823 21.4086 12.4656 21.7048C9.50415 22.1192 6.47736 21.23 4.37704 18.9777C2.36838 16.8236 1.66208 13.91 2.14725 11.101C2.5317 8.87524 3.66405 6.70447 5.49864 4.99369C7.22808 3.38096 9.32167 2.41934 11.4383 2.12316C14.3161 1.72048 17.6687 2.24881 19.8148 4.55022C21.7914 6.66994 22.1731 9.77848 21.8079 12.3987Z"
      fill="currentColor"
    />
  </svg>
);
export const ToolPETSegment = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M20.7108 20.7795C20.2638 20.7795 19.9924 20.4921 19.9924 20.0132V14.6703H18.4545C18.098 14.6703 17.8372 14.4148 17.8372 14.0689C17.8372 13.7177 18.098 13.4623 18.4545 13.4623H22.9724C23.3343 13.4623 23.5897 13.7124 23.5897 14.0689C23.5897 14.4202 23.3343 14.6703 22.9724 14.6703H21.4292V20.0132C21.4292 20.4868 21.1525 20.7795 20.7108 20.7795Z"
      fill="currentColor"
    />
    <path
      d="M12.8614 20.7795C12.4091 20.7795 12.1483 20.4921 12.1483 20.0025V14.5106C12.1483 13.755 12.4357 13.4623 13.186 13.4623H15.0219C16.5332 13.4623 17.507 14.4095 17.507 15.8464C17.507 17.347 16.5226 18.2357 14.9634 18.2357H13.5851V20.0025C13.5851 20.4921 13.319 20.7795 12.8614 20.7795ZM13.5851 17.1182H14.5057C15.6232 17.1182 16.0755 16.7936 16.0755 15.8676C16.0755 15.0694 15.6285 14.6117 14.841 14.6117H13.5851V17.1182Z"
      fill="currentColor"
    />
    <path
      d="M16.2855 10.7063C16.5677 8.68223 16.254 6.39013 14.8334 4.86666C13.2881 3.20953 10.8171 2.78346 8.59798 3.09398C7.01269 3.31581 5.43737 4.03721 4.13198 5.25454C2.74718 6.54592 1.89791 8.17926 1.61016 9.84527C1.24697 11.9481 1.77832 14.1031 3.25643 15.6882C4.80168 17.3453 7.04033 18.0136 9.25943 17.7031"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
export const ToolInterpolation = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M4 12.5H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 2.5H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 21.5H16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 7.5H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 16.5H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
export const ToolBidirectionalSegment = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M6.1853 15.6532L18.4009 8.77848"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8.76544 7.91235L13.832 16.5978"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4.14157 17.3088C2.76981 15.2751 2.67514 12.6925 3.6387 10.2811C4.4021 8.37067 5.82976 6.56762 7.81284 5.23002C9.6822 3.96912 12.3566 4.73828 14.311 4.67465C17.0466 4.58559 19.2925 3.97045 20.7266 6.09655C22.045 8.05118 20.748 11.3759 19.9013 13.7053C19.1692 15.7197 18.7965 17.0264 16.7161 18.4296C14.8467 19.6905 12.7787 20.3389 10.8244 20.4025C8.0887 20.4916 5.57565 19.4349 4.14157 17.3088Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
export const ToolExpand = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M19.9346 11.1104C19.7061 11.1104 19.5156 11.0342 19.3633 10.8818C19.2109 10.7236 19.1348 10.5273 19.1348 10.293V9.55469L19.3193 6.4873L16.999 8.92188L14.3008 11.6465C14.1543 11.7988 13.9668 11.875 13.7383 11.875C13.4922 11.875 13.2842 11.8018 13.1143 11.6553C12.9502 11.5029 12.8682 11.3037 12.8682 11.0576C12.8682 10.9404 12.8887 10.8291 12.9297 10.7236C12.9707 10.6182 13.0322 10.5273 13.1143 10.4512L15.8213 7.74414L18.2646 5.43262L15.1885 5.6084H14.4502C14.2158 5.6084 14.0195 5.53516 13.8613 5.38867C13.7031 5.23633 13.624 5.04297 13.624 4.80859C13.624 4.57422 13.7031 4.38086 13.8613 4.22852C14.0195 4.07617 14.2158 4 14.4502 4H19.3281C19.7793 4 20.1279 4.12598 20.374 4.37793C20.626 4.62402 20.752 4.96973 20.752 5.41504V10.293C20.752 10.5215 20.6729 10.7148 20.5146 10.873C20.3623 11.0312 20.1689 11.1104 19.9346 11.1104ZM10.293 20.7695H5.41504C4.96973 20.7695 4.62109 20.6436 4.36914 20.3916C4.12305 20.1455 4 19.7998 4 19.3545V14.4766C4 14.248 4.07617 14.0547 4.22852 13.8965C4.38086 13.7383 4.57422 13.6592 4.80859 13.6592C5.04297 13.6592 5.2334 13.7383 5.37988 13.8965C5.53223 14.0488 5.6084 14.2422 5.6084 14.4766V15.2148L5.43262 18.2822L7.74414 15.8477L10.4512 13.123C10.5977 12.9707 10.7822 12.8945 11.0049 12.8945C11.2568 12.8945 11.4648 12.9707 11.6289 13.123C11.793 13.2695 11.875 13.4658 11.875 13.7119C11.875 13.8291 11.8545 13.9404 11.8135 14.0459C11.7725 14.1514 11.7139 14.2422 11.6377 14.3184L8.92188 17.0254L6.4873 19.3369L9.56348 19.1611H10.293C10.5273 19.1611 10.7236 19.2344 10.8818 19.3809C11.04 19.5332 11.1191 19.7266 11.1191 19.9609C11.1191 20.1953 11.04 20.3887 10.8818 20.541C10.7295 20.6934 10.5332 20.7695 10.293 20.7695Z"
      fill="currentColor"
    />
  </svg>
);
export const ToolContract = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M13.1162 5.08203C13.1162 4.84766 13.1924 4.65137 13.3447 4.49316C13.4971 4.33496 13.6904 4.25586 13.9248 4.25586C14.1592 4.25586 14.3496 4.33496 14.4961 4.49316C14.6484 4.65137 14.7246 4.84766 14.7246 5.08203V5.82031L14.5488 8.8877L16.8604 6.45312L19.5674 3.74609C19.6494 3.66406 19.7402 3.60254 19.8398 3.56152C19.9453 3.52051 20.0566 3.5 20.1738 3.5C20.4199 3.5 20.6191 3.58203 20.7715 3.74609C20.9238 3.91016 21 4.11816 21 4.37012C21 4.59277 20.9209 4.78027 20.7627 4.93262L18.0381 7.63086L15.6035 9.95117L18.6709 9.7666H19.4092C19.6436 9.7666 19.8369 9.83984 19.9893 9.98633C20.1475 10.1387 20.2266 10.332 20.2266 10.5664C20.2266 10.8008 20.1475 10.9941 19.9893 11.1465C19.8311 11.2988 19.6377 11.375 19.4092 11.375H14.54C14.0889 11.375 13.7373 11.252 13.4854 11.0059C13.2393 10.7598 13.1162 10.4111 13.1162 9.95996V5.08203ZM4.19531 13.5107C4.19531 13.2764 4.27441 13.083 4.43262 12.9307C4.58496 12.7783 4.77832 12.7021 5.0127 12.7021H9.97852C10.4297 12.7021 10.7783 12.8252 11.0244 13.0713C11.2705 13.3174 11.3936 13.666 11.3936 14.1172V19.0918C11.3936 19.3262 11.3174 19.5225 11.165 19.6807C11.0186 19.8389 10.8252 19.918 10.585 19.918C10.3506 19.918 10.1602 19.8389 10.0137 19.6807C9.86719 19.5225 9.79395 19.3262 9.79395 19.0918V18.2568L9.96973 15.1807L7.6582 17.624L4.88965 20.3926C4.80762 20.4688 4.7168 20.5273 4.61719 20.5684C4.51172 20.6094 4.40039 20.6299 4.2832 20.6299C4.03711 20.6299 3.83789 20.5479 3.68555 20.3838C3.5332 20.2197 3.45703 20.0146 3.45703 19.7686C3.45703 19.54 3.53613 19.3525 3.69434 19.2061L6.47168 16.4463L8.90625 14.126L5.84766 14.3105H5.0127C4.77832 14.3105 4.58496 14.2344 4.43262 14.082C4.27441 13.9297 4.19531 13.7393 4.19531 13.5107Z"
      fill="currentColor"
    />
  </svg>
);
