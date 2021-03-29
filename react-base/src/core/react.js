import Component from './component'
import {wrapToVdom} from '../utils'
/**
 * 
 * @param {*} type 元素的类型 
 * @param {*} config 配置
 * @param {*} children 子节点
 */
function createElement(type,config,children) {
    let ref;
    let key;
    if(config){
        delete config.__source;
        delete config.__self;
        ref = config.ref;// 添加ref
        delete config.ref;
        key = config.key;// 添加key
        delete config.key;
    }
    let props = {...config}
    // 把额外的参数，拼接到子节点中
    if(arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
    }else {
        props.children = wrapToVdom(children)
    }
    
    return {
        type,
        props,
        ref,
        key
    }
}

export function createRef() {
    return {
        current: null
    }
}

const React = {createElement,Component,createRef}
export default React