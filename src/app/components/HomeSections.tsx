import AboutSection from './sections/AboutSection'
import BeforeAfterSection from './sections/BeforeAfterSection'
import GallerySection from './sections/GallerySection'
import PricesSection from './sections/PricesSection'
import ReviewsSection from './sections/ReviewsSection'
import ServicesSection from './sections/ServicesSection'

export default function HomeSections() {
  return (
    <>
      <AboutSection />
      <ServicesSection />
      <PricesSection />
      <BeforeAfterSection />
      <GallerySection />
      <ReviewsSection />
    </>
  )
}
