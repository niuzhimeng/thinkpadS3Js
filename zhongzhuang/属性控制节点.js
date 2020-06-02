// 第4节点字段
let zgldId = WfForm.convertFieldNameToId("zgld"); // 主办主管领导
let cbzgldId = WfForm.convertFieldNameToId("cbzgld"); // 从办主管领导
let cbbmfzrId = WfForm.convertFieldNameToId("cbbmfzr"); // 承办部门负责人

// 第5节点字段
let cbbmfzr1Id = WfForm.convertFieldNameToId("cbbmfzr1"); // 从办部门负责人
let cbr1Id = WfForm.convertFieldNameToId("cbr1"); // 承办人
let jbrId = WfForm.convertFieldNameToId("jbr"); // 经办人
// 第6节点字段
let tzxgryckId = WfForm.convertFieldNameToId("tzxgryck"); // 通知相关人员查看

let {f_weaver_belongto_userid: currentUserId} = WfForm.getBaseInfo();
let {requestid} = WfForm.getBaseInfo();
let {nodeid} = WfForm.getBaseInfo();

/**
 * 第4节点方法
 * 根据从办领导 隐藏承办部门负责人
 */
myChangeFieldAttr4 = () => {
    let cbzgldIdVal = WfForm.getFieldValue(cbzgldId).split(',');
    let zgldIdVal = WfForm.getFieldValue(zgldId).split(',');
    cbzgldIdVal = cbzgldIdVal.filter(item => zgldIdVal.indexOf(item) === -1);
    if (cbzgldIdVal.indexOf(currentUserId) > -1) {
        WfForm.changeFieldAttr(cbbmfzrId, 1);
    }

    if (zgldIdVal.indexOf(currentUserId) > -1) {
        // 当前人属于【主管领导】，执行提交校验
        WfForm.registerCheckEvent(WfForm.OPER_SUBMIT, (callback) => {
            let options = {
                url: '/devjsp8/zhongzhuang/SubmitCheck.jsp',
                method: 'POST',
                params: {
                    'requestId': requestid,
                    'cbzgldIdVal': cbzgldIdVal.toString(), // 分管领导
                    'nodeId': nodeid,
                },
            };
            window.weaJs.callApi(options).then((res) => {
                if (res.state) {
                    callback();
                } else {
                    window.weaJs.alert('存在经办人尚未签署意见。');
                }
            });

        });
    }
}
/**
 * 第5节点方法
 * 5节点根据从办部门负责人字段  判断隐藏承办人，经办人字段
 */
myChangeFieldAttr5 = () => {
    let cbzgldIdVal = WfForm.getFieldValue(cbbmfzr1Id).split(',');
    let zgldIdVal = WfForm.getFieldValue(cbbmfzrId).split(',');
    cbzgldIdVal = cbzgldIdVal.filter(item => zgldIdVal.indexOf(item) === -1);
    if (cbzgldIdVal.indexOf(currentUserId) > -1) {
        WfForm.changeFieldAttr(cbr1Id, 1);
        WfForm.changeFieldAttr(jbrId, 1);
    }
}
/**
 * 第6节点方法
 * 6节点根据经办人隐藏通过相关人员查看
 */
myChangeFieldAttr6 = () => {
    let cbzgldIdVal = WfForm.getFieldValue(jbrId).split(',');
    let zgldIdVal = WfForm.getFieldValue(cbr1Id).split(',');
    cbzgldIdVal = cbzgldIdVal.filter(item => zgldIdVal.indexOf(item) === -1);
    if (cbzgldIdVal.indexOf(currentUserId) > -1) {
        WfForm.changeFieldAttr(tzxgryckId, 1);
    }
}

if (nodeid === 298) {
    myChangeFieldAttr4(); // 第四节点
} else if (nodeid === 299) {
    myChangeFieldAttr5();
} else if (nodeid === 300) {
    myChangeFieldAttr6();
}
