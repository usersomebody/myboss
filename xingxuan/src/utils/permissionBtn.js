import permission from '../store/modules/permission.js'
export function permissionBtn(pathName) {
    let permissionObj = {
        list: {
            id: 1,
            isHas: true
        },
        add: {
            id: 2,
            isHas: true
        },
        edit: {
            id: 3,
            isHas: true
        },
        del: {
            id: 4,
            isHas: true
        }
    }
    if (permission.state.btn_permission.length) {
        let currentUserBtnPermission = permission.state.btn_permission.filter((item) => {
            return item.path === pathName
        })
        if (currentUserBtnPermission.length) {
            permissionObj = {
                list: {
                    id: 1,
                    isHas: currentUserBtnPermission[0].detail.url_type.indexOf(1) > -1 ? true : false
                },
                add: {
                    id: 2,
                    isHas: currentUserBtnPermission[0].detail.url_type.indexOf(2) > -1 ? true : false
                },
                edit: {
                    id: 3,
                    isHas: currentUserBtnPermission[0].detail.url_type.indexOf(3) > -1 ? true : false
                },
                del: {
                    id: 4,
                    isHas: currentUserBtnPermission[0].detail.url_type.indexOf(4) > -1 ? true : false
                }
            }
        }
    }

    return permissionObj
}
