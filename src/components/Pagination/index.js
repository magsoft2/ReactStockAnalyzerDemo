import React, {PureComponent} from "react";
import classnames from "classnames";

import "./index.styl";

const SEPARATOR = "...";
const pagination = (c, m) => {
    var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push(SEPARATOR);
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

export class Pagination  extends PureComponent {
    renderPrevControl = () => {
        let {
            current,
            onChange,
        } = this.props;

        return (
            <div className="Pagination-prev" onClick={() => current !== 1 && onChange(current - 1)}>
                Назад
            </div>
        )
    }

    renderNextControl = () => {
        let {
            current,
            last,
            onChange,
        } = this.props;

        return (
            <div className="Pagination-next" onClick={() => current !== last && onChange(current + 1)}>
                Далее
            </div>
        )
    }

    renderItem = (page, key) => {
        let {
            current,
            last,
            onChange,
        } = this.props;
        const classNames = classnames("Pagination-item", {
            "separator-item": page === SEPARATOR,
            "selected": page === current,
        });
        const clickProps = page === SEPARATOR ? {} : {
            onClick: () => page !== current && onChange(page)
        }
        return (
            <div className={classNames} key={key} {...clickProps}>
                {page}
            </div>
        );
    }

    render = () => {
        const {
            current,
            last,
            isMobile,
        } = this.props;
        const onlyPage = last === 1;
        return (
            <div className="Pagination">
                {onlyPage ? null : this.renderPrevControl()}
                {!isMobile && pagination(current, last).map(this.renderItem)}
                {onlyPage ? null : this.renderNextControl()}
            </div>
        );
    }
}

export default Pagination;
