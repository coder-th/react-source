import { updateQueue } from "./component";
let syntheticEvent = {}
/**
 * 添加事件处理函数,这里就是合成事件
 * 作用： 1. 做兼容处理，不同的事件，浏览器是不同的，2 统一添加批量更新的标识符，可以在执行前后做一些事情
 * @param {*} dom 事件的dom
 * @param {*} eventType 事件类型
 * @param {*} listener 执行函数
 */
export function addEvent(dom, eventType, listener) {
    let store;
    if(dom.store){
        store = dom.store;
    }else{
        dom.store={};
        store=dom.store;
    }
    store[eventType] = listener;
    if (!document[eventType]) {
        //事件委托，不管给哪一个元素绑定事件，最后都统一代理到document
        document[eventType] = dispatchEvent
    }
}
/**
 * 派发事件
 * @param {*} event 
 */
function dispatchEvent(event) {
    let { target, type } = event;// type=click,事件类型
    let eventType = 'on' + type
    updateQueue.isBatchingUpdate = true;// 设置为批量更新
    syntheticEvent = createSyntheticEvent(event);// 创建合成事件
    while(target) {
        let { store } = target;
        let listener = store && store[eventType]
        listener && listener.call(target, syntheticEvent)
        // 不断寻找到有该事件的dom元素，实现事件冒泡
        target = target.parentNode
    }
    for(let key in syntheticEvent) {
        // 重置合成事件
        syntheticEvent[key] = null
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.batchUpdate();// 进行批量更新
}
/**
 * 根据原生的事件，合成新的事件，进行格式化或兼容处理
 * @param {*} nativeEvent 
 */
function createSyntheticEvent(nativeEvent) {
    for(let key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key]
    }
    return syntheticEvent
}