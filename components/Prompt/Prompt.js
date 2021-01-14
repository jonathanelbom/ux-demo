import {useReducer, useEffect, useRef, Fragment} from 'react';
import classnames from 'classnames';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Item from '../Item/Item';
import styles from './Prompt.module.scss'

export default function Prompt({items = []}) {
	const getUpdatedItems = (term, sortKey) => {
		const updatedItems = items.filter(({name}) => {
			let index = index = name.toLowerCase().indexOf(term.toLowerCase())
			return term && index > -1
		});
		updatedItems.sort((aItem, bItem) => {
			const a = aItem[sortKey];
			const b = bItem[sortKey];
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			return 0;
		});
		return updatedItems;
	};
	const reducer = (state, newState) => {
		// generally just merge oldState and newState
		let updatedState = {...state, ...newState};
		const {action} = newState;
		if (action && action.type) {
			// if term or sortKey changes, update sorted and filterd items
			if (action.type === 'term' || action.type === 'sortKey') {
				const {term, sortKey} = updatedState;
				updatedState = {
					...updatedState,
					sortedAndFilteredItems: [...getUpdatedItems(term, sortKey)],
				};
			}
		}
		return updatedState;
	}
	const [state, setState] = useReducer(reducer, {
		isOpen: false,
		term: '',
		sortKey: 'name',
		sortedAndFilteredItems: [],
	});
	const inputElem = useRef(null);
	const updateSort = (sortKey) => {
		setState({
			sortKey,
			action: {type: 'sortKey'},
		})
	}
	const handleInputChange = (e) => {
		const term = e.target.value.replace(/\s/g, '');
		setState({
			term,
			action: {type: 'term'},
		});
	}
	const clearInput = () => {
		setState({
			term: '',
			action: {type: 'term'},
		});
	}
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (state.isOpen) {
				if (e.key === 'Escape') {
					setState({isOpen: false});
				}
			} else {
				e.preventDefault();
				setState({isOpen: true});
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [state.isOpen])

	return (
		<Fragment>
			<CSSTransition
				in={!state.isOpen}
				timeout={300}
				classNames="instructions"
				mountOnEnter
				unmountOnExit
			>
				<div className={classnames('instructions', styles.instructions_wrapper)} key={`isntructions-trans-${!state.isOpen ? 'enter' : 'exit'}`}>
					<div className={styles.instructions}>
						<span className={styles.instructions_main}>
							{'This is a front-end challenge exercise where I get to demonstrate my craft of creating engaging interactive experience.'}
						</span>
						<span className={styles.instructions_start}>
							{'Click any key to get started'}
						</span>
					</div>
				</div>
			</CSSTransition>
			<CSSTransition
				in={state.isOpen}
				timeout={{
					enter: 1200,
					exit: 500
				}}
				onEnter={clearInput}
				onEntering={() => inputElem.current.focus()}
				onExit={() => inputElem.current.blur()}
				classNames="prompt"
				mountOnEnter
				unmountOnExit
			>
				<div className="prompt" key={`prompt-trans-${state.isOpen ? 'enter' : 'exit'}`}>
					<div className={classnames(styles.skrim, 'skrim')} />
					<div className={styles.prompt}>
						<div className={classnames(styles.title, styles.title__top,'title__top')}>
							{'Search for pups, doggos, chonks!'}<br/>
							<span style={{fontSize: '14px', color: 'rgba(255, 255, 255, .4)'}}>{'Try using names that start with "B"'}</span>
						</div>
						<div className={classnames(styles.dialog, 'dialog')}>
							<div className={styles.input__row}>
								<input
									className={styles.input}
									value={state.term}
									onChange={handleInputChange}
									ref={inputElem}	
									placeholder="Search for things"
								/>
								<div className={classnames(styles.dog__icon, {
									[styles.open__animation]: state.sortedAndFilteredItems.length > 0,
									[styles.close__animation]: state.sortedAndFilteredItems.length === 0,
								})}>
									<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M20.7584 18.8809C19.0387 18.8809 17.6221 20.2975 17.6221 22.0172C17.6221 23.737 19.0387 25.1536 20.7584 25.1536C22.4782 25.1536 23.8948 23.7369 23.8948 22.0172C23.8948 20.2975 22.4782 18.8809 20.7584 18.8809ZM20.7584 20.9718C21.3489 20.9718 21.8039 21.4268 21.8039 22.0172C21.8039 22.6077 21.3489 23.0627 20.7584 23.0627C20.1681 23.0627 19.713 22.6076 19.713 22.0172C19.713 21.4268 20.1681 20.9718 20.7584 20.9718Z" />
										<path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M30.945 18.8809C29.2252 18.8809 27.8086 20.2975 27.8086 22.0172C27.8086 23.737 29.2252 25.1536 30.945 25.1536C32.6647 25.1536 34.0813 23.737 34.0813 22.0172C34.0813 20.2975 32.6647 18.8809 30.945 18.8809V18.8809ZM30.945 20.9718C31.5353 20.9718 31.9904 21.4268 31.9904 22.0172C31.9904 22.6076 31.5353 23.0627 30.945 23.0627C30.3545 23.0627 29.8995 22.6076 29.8995 22.0172C29.8995 21.4268 30.3545 20.9718 30.945 20.9718Z" />
										<path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M25.7549 9.00035C22.774 8.98096 19.8268 9.76073 17.2606 11.3853C13.8222 11.9078 11.0378 13.2033 8.99507 14.5707C6.94127 15.9454 5.65082 17.3133 5.05826 18.3441C3.93429 19.9481 2.99511 22.691 3.00002 25.6949C3.00525 28.7289 4.12791 32.0725 7.36155 34.1402C7.5229 34.2429 7.70934 34.2994 7.90058 34.3036C9.63285 34.3245 10.9662 33.1596 11.821 31.6573C11.8717 31.5686 11.9194 31.4712 11.968 31.3796C12.8861 33.7544 14.3242 36.0545 16.1662 37.9464C18.7295 40.579 22.0905 42.4549 25.8203 42.4549C29.5516 42.4549 32.8584 40.6229 35.4091 38.0117C37.317 36.0584 38.8218 33.6558 39.8523 31.1509C40.0978 31.6246 40.3682 32.0615 40.669 32.4577C41.4895 33.5386 42.6731 34.3209 44.0831 34.3036C44.2799 34.3025 44.4724 34.2458 44.6384 34.1402C47.8721 32.0725 48.995 28.7289 49 25.6949C49.0052 22.6905 48.0659 19.948 46.9417 18.3441C46.3237 17.2715 44.973 15.9434 42.8579 14.587C40.7515 13.2363 37.905 11.9564 34.4616 11.4343C31.7632 9.84164 28.7454 9.01981 25.7549 9.00035V9.00035ZM25.7549 11.0913C28.3545 11.1096 30.9939 11.8223 33.3672 13.2149C36.0314 17.5574 37.1645 23.6656 38.6598 28.1943C37.8136 31.1958 36.1342 34.2607 33.9062 36.5415C31.9328 38.5618 29.5715 39.9576 26.9801 40.2823V36.2965C27.7471 36.0119 28.4166 35.645 28.9566 35.1203C29.6988 34.3994 30.1207 33.3815 30.1655 32.2617C30.1701 32.0738 30.1239 31.8882 30.032 31.7244C29.94 31.5605 29.8055 31.4245 29.6428 31.3306C28.568 30.6973 27.2545 30.4083 25.9347 30.3995C24.6148 30.3906 23.2926 30.6572 22.2102 31.3469C22.0631 31.4392 21.9412 31.5667 21.8556 31.7178C21.7701 31.869 21.7235 32.0391 21.7202 32.2127C21.7045 33.3239 22.0503 34.3468 22.7493 35.0877C23.3124 35.6846 24.0414 36.0957 24.8892 36.3945V40.2987C22.2133 40.0194 19.7063 38.5686 17.669 36.4762C15.426 34.1725 13.7997 31.1144 13.2095 28.2759C13.4293 27.5768 13.6391 26.8501 13.8466 26.087C14.9912 21.8779 16.1121 16.848 18.3878 13.1495C20.5965 11.7541 23.1543 11.073 25.7549 11.0913V11.0913ZM15.5945 13.8683C13.7279 17.6519 12.7839 21.9905 11.821 25.5316C11.2506 27.6294 10.6745 29.4565 10.0078 30.6282C9.41754 31.6654 8.91081 32.1116 8.21098 32.1964C5.85087 30.553 5.09495 28.1574 5.09093 25.6949C5.0857 23.1414 6.03 20.5695 6.78979 19.5039C6.81339 19.4725 6.83521 19.4398 6.85513 19.4059C7.12015 18.9324 8.29733 17.5455 10.1548 16.3022C11.5712 15.3541 13.3933 14.4488 15.5945 13.8683V13.8683ZM36.1441 13.9173C38.3754 14.4966 40.2596 15.4078 41.7308 16.3512C43.6571 17.5865 44.9049 18.9772 45.1449 19.4059C45.1595 19.4394 45.1759 19.4721 45.194 19.5039C45.9538 20.5695 46.9133 23.1413 46.9092 25.6949C46.9039 28.1575 46.1494 30.553 43.7891 32.1964C43.2413 32.1313 42.8253 31.8453 42.3353 31.1999C41.7647 30.4482 41.2212 29.2274 40.7181 27.7368C39.4496 23.964 38.4416 18.5259 36.1442 13.9173H36.1441ZM25.9183 32.4904C26.6478 32.4956 27.385 32.6344 27.9765 32.8498C27.8852 33.168 27.7346 33.3923 27.5028 33.6175C27.1724 33.9385 26.6093 34.2363 25.804 34.4833C25.0451 34.2402 24.553 33.9518 24.2685 33.6502C24.0557 33.4246 23.9257 33.196 23.8601 32.8498C24.4359 32.6243 25.1667 32.4854 25.9183 32.4904Z"/>
									</svg>
								</div> 
							</div>
							<CSSTransition
								in={state.sortedAndFilteredItems.length > 0}
								timeout={250}
								classNames="content"
								mountOnEnter
								unmountOnExit
							>
								<div className={classnames(styles.content, 'content')}>
									<div className={styles.toggle}>
										<div
											className={styles.toggle__option}
											data-selected={state.sortKey === 'name'}
											role="button"
											tabIndex="0"
											onClick={() => updateSort('name')}
										>
											{'Name'}
										</div>
										<div
											className={styles.toggle__option}
											data-selected={state.sortKey === 'birthday'}
											role="button"
											tabIndex="0"
											onClick={() => updateSort('birthday')}
										>
											{'Birthday'}
										</div>
									</div>
									<div className={styles.items__title}>{'Pups:'}</div>
								</div>
							</CSSTransition>
							<TransitionGroup
								component={'ul'}
								className="items"
							>
								{state.sortedAndFilteredItems.map((item, i) =>
									<CSSTransition
										key={`item-${item.id}`}
										timeout={500}
										classNames="item"
									>
										<Item {...item} sortKey={state.sortKey} index={i} />
									</CSSTransition>
								)}
							</TransitionGroup>
						</div>
						<div className={classnames(styles.title, styles.title__bottom, 'title__bottom')}>{'Press '}<span className={styles.esc}>{'esc'}</span>{' to close'}</div>
					</div>
				</div>
			</CSSTransition>
		</Fragment>
	);
}
