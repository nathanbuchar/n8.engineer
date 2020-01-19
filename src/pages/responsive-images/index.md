# Responsive Images
###### Jan 18, 2020

<br/>

I started working with [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) in 2015, but haven't messed with them much lately. This is a re-exploration into responsive images using `picture` and `srcset` with some photos of mine taken at Pt. Cabrillo, California in 2018.

<picture>
  <img
    sizes="(max-width: 1400px) 100vw, 1400px"
    srcset="
      ./img/DSCF6590_200w.jpg 200w,
      ./img/DSCF6590_481w.jpg 481w,
      ./img/DSCF6590_668w.jpg 668w,
      ./img/DSCF6590_839w.jpg 839w,
      ./img/DSCF6590_971w.jpg 971w,
      ./img/DSCF6590_1083w.jpg 1083w,
      ./img/DSCF6590_1192w.jpg 1192w,
      ./img/DSCF6590_1305w.jpg 1305w,
      ./img/DSCF6590_1397w.jpg 1397w,
      ./img/DSCF6590_1400w.jpg 1400w"
    src="./img/DSCF6590_1400w.jpg"
    alt="">
</picture>

<picture>
  <img
    sizes="(max-width: 1400px) 100vw, 1400px"
    srcset="
      ./img/DSCF6602_200w.jpg 200w,
      ./img/DSCF6602_472w.jpg 472w,
      ./img/DSCF6602_675w.jpg 675w,
      ./img/DSCF6602_817w.jpg 817w,
      ./img/DSCF6602_957w.jpg 957w,
      ./img/DSCF6602_1084w.jpg 1084w,
      ./img/DSCF6602_1194w.jpg 1194w,
      ./img/DSCF6602_1311w.jpg 1311w,
      ./img/DSCF6602_1377w.jpg 1377w,
      ./img/DSCF6602_1400w.jpg 1400w"
    src="./img/DSCF6602_1400w.jpg"
    alt="">
</picture>
