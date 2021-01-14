import {useMemo, useState, useRef} from 'react';
import classnames from 'classnames';
import {CSSTransition} from 'react-transition-group';
import styles from './Item.module.scss'

export default function Item({id, type, name, birthday, image, sortKey, index}) {
    const makeKey = () => `item-${Math.random().toString(16).slice(2)}`;
    const prevSortKey = useRef(sortKey);
    const sortChanged = sortKey !== prevSortKey.current;
    prevSortKey.current = sortKey;
    const prevIndex = useRef(index);
    const indexChanged = index !== prevIndex.current;
    prevIndex.current = index;
    const innerKey = useRef(makeKey())
    const formattedDate = useMemo(() => new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(birthday.replace(/-/gi, '/'))
    , [birthday]));
    const hasChanged = sortChanged || indexChanged // sortChanged && indexChanged
    if (sortChanged || indexChanged) {
        innerKey.current = makeKey();
    }
    return (
        <li className={classnames(styles.item, 'item')}>
            <div
                className={classnames(styles.item_inner, {[styles.item_inner_sort]: hasChanged})}
                key={innerKey.current}
            >
                <div className={styles.image} style={{backgroundImage: `url('${image}')`}}>
                    <span role="img" aria-label={`Picture of ${type} named ${name}`} />
                </div>
                <div className={styles.name}>{name}</div>
                <div className={styles.birthday}>{formattedDate}</div>
                <div className={styles.controls}>
                    <div role="button" tabIndex="0" className={styles.enter}>{'enter'}</div>
                    <div role="button" tabIndex="0" className={styles.launch}>{'Launch'}</div>
                </div>
            </div>
        </li>
    );
}
