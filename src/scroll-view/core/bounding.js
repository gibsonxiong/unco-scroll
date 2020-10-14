/* eslint-disable */
export default {
    isOverUpperBounding(axis, scrollPos, contain) {
        const minScrollPos = axis === 'x' ? this.minScrollX : this.minScrollY;

        if (scrollPos === undefined) {
            scrollPos = this.getScrollPos(axis);
        }

        if (contain) {
            return this.decimal(scrollPos) <= this.decimal(minScrollPos);
        } else {
            return this.decimal(scrollPos) < this.decimal(minScrollPos);
        }
    },

    isOverLowerBounding(axis, scrollPos, contain) {
        const maxScrollPos = axis === 'x' ? this.maxScrollX : this.maxScrollY;

        if (scrollPos === undefined) {
            scrollPos = this.getScrollPos(axis);
        }

        if (contain) {
            return this.decimal(scrollPos) >= this.decimal(maxScrollPos);
        } else {
            return this.decimal(scrollPos) > this.decimal(maxScrollPos);
        }
    },

    isOverBounding(axis, scrollPos, contain) {
        return this.isOverUpperBounding(axis, scrollPos, contain) || this.isOverLowerBounding(axis, scrollPos, contain);
    },
}