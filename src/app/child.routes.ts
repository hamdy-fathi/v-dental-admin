import { Route } from '@angular/router';
import { blogRoutes } from '@pages/blogs/blog.routes';
import { CategoriesRoutes } from '@pages/categories/categories.routes';
import { generalSettingsRoutes } from '@pages/general-settings/general-settings.routes';
import { sectionBranchesRoutes } from '@pages/section-branches/section-branches.routes';
import { sectionDoctorsRoutes } from '@pages/section-doctors/section-doctors.routes';
import { sectionFiveRoutes } from '@pages/section-five/section-five.routes';
import { sectionFourRoutes } from '@pages/section-four/section-four.routes';
import { sectionOneRoutes } from '@pages/section-one/section-one.routes';
import { sectionReviewsRoutes } from '@pages/section-reviews/section-reviews.routes';
import { sectionThreeRoutes } from '@pages/section-three/section-three.routes';
import { sectionTwoRoutes } from '@pages/section-two/section-two.routes';
import { userRoutes } from '@pages/users/user.routes';

export default [
  ...generalSettingsRoutes,
  ...sectionOneRoutes,
  ...sectionTwoRoutes,
  ...blogRoutes,
  ...CategoriesRoutes,
  ...sectionThreeRoutes,
  ...sectionFourRoutes,
  ...sectionFiveRoutes,
  ...sectionReviewsRoutes,
  ...sectionBranchesRoutes,
  ...sectionDoctorsRoutes,
  ...userRoutes,
] as Route[];
