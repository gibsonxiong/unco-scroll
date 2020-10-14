export default class ScrollViewManager {
  static instances = {};
  static scrollingAxisMap = {};

  // static add(scrollView, axis) {
  //   ScrollViewManager.scrollingAxisMap[scrollView.id] = axis;
  // }

  // static remove(scrollView) {
  //   delete ScrollViewManager.scrollingAxisMap[scrollView.id];
  // }

  // static isScrolling(scrollView) {
  //   return !!ScrollViewManager.scrollingAxisMap[scrollView.id];
  // }

  static isParentScrolling(scrollView) {
    let parent = scrollView.wrapper.parentElement;

    while (parent) {
      if (parent.scrollView && parent.scrollView.isScrolling) {
        return true;
      } else {
        parent = parent.parentElement;
      }
    }

    return false;
  }

  // static getScrollingAxis(scrollView) {
  //   return ScrollViewManager.scrollingAxisMap[scrollView.id];
  // }
}