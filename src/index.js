import ScrollView from './scroll-view/core';

import Scrollbar from './scroll-view/scrollbar';
import Snap from './scroll-view/snap';
import Paging from './scroll-view/paging';
import Lazyload from './scroll-view/lazyload';
import Sticky from './scroll-view/sticky';
import ItemGroup from './scroll-view/item-group';
import { TopPullLoader, BottomPullLoader, LeftPullLoader, RightPullLoader } from './scroll-view/pull-loader';

ScrollView.use(Scrollbar);
ScrollView.use(Snap);
ScrollView.use(Paging);
ScrollView.use(Lazyload);
ScrollView.use(ItemGroup);
ScrollView.use(Sticky);
ScrollView.use(TopPullLoader);
ScrollView.use(BottomPullLoader);
ScrollView.use(LeftPullLoader);
ScrollView.use(RightPullLoader);

export default ScrollView;

export { default as animation } from './animation';
export { default as touch }  from './touch';
