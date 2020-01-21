# Responsive Images
###### Jan 18, 2020

I started working with [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) in 2015, but haven't messed with them much lately. This is a re-exploration into responsive images using `picture` and `srcset` with some photos of mine taken at Pt. Cabrillo, California in 2018.

<picture>
  <img
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
