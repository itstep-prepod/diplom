import {createContext, useState, useEffect, Children, cloneElement, useContext, useReducer, useRef } from "react";
import styles from "./carusel.module.css";

const oneHundredPercent = "100%";

const childWidth = 100;

const interval = 5000;

type ItervalType = number | undefined

const CaruselContext = createContext({});

export const Carusel = ({ children }) => {
	const [children2, setChildren2] = useState([]);
	const [childrenState, setChildrenState] = useState([]);
	const [offset, setOffset] = useState(0);
	const [shoodShowBtn, setShoodShowBtn] = useState(false);

	const onClickRightBtn = () => {
		const maxOffset = -(childWidth * (childrenState.length - 1));
		setOffset(currenOffset => {
			if (maxOffset === currenOffset) {
				return 0;
			}
			return Math.max(currenOffset - childWidth, maxOffset);
		});
	};

	const onClickLeftBtn = () => {
		setOffset(currenOffset => Math.min(currenOffset + childWidth, 0));
	};

	const enterMouseCarusel = () => {
		setShoodShowBtn(true);
	};

	const leaveMouseCarusel = () => {
		setShoodShowBtn(false);

	}

	useEffect(() => {
		setChildrenState(
			Children.map(children, child =>(
				cloneElement(child, {
					style: {
						height: oneHundredPercent,
						minWidth: oneHundredPercent,
						maxWidth: oneHundredPercent,
					},
				})
			))
		);
	}, [children]);

	const setMyClientWdith = (width, id) => {
		
	}

	useEffect(() => {
		let intervalId:ItervalType;
		if (childrenState.length && !shoodShowBtn) {
			intervalId = setInterval(onClickRightBtn, interval);
		} else {
			clearInterval(intervalId);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [childrenState,shoodShowBtn]);

	return (
		<CaruselContext.Provider value={{setMyClientWdith}}>
		<div className={styles.container} onMouseEnter={enterMouseCarusel} onMouseLeave={leaveMouseCarusel}>
			{shoodShowBtn && (
				<button className={styles.right} onClick={onClickRightBtn}>
					right
				</button>
			)}
			<div className={styles.window}>
				<div
					className={styles.all_items_container}
					style={{
						transform: `translateX(${offset}%)`,
					}}
				>
					{childrenState}
				</div>
			</div>
			{shoodShowBtn && (
				<button className={styles.left} onClick={onClickLeftBtn}>
					left
				</button>
			)}
		</div>
		</CaruselContext.Provider>
	);
};

Carusel.Item = ({children}) => {
	const {setMyClientWidth} = useContext(CaruselContext);
	const itemRef = useRef(null);

	setMyClientWidth(itemRef.current.clientWidth, id)

	return <div ref={itemRef}>
		{children}
	</div>
};