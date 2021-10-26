
// 我们可以把这个方法放到公共的js文件中（utils.js或common.js）
export async function sleep(time) {
    return new Promise((resolve) => {
        setInterval(() => {
            resolve();
        }, time);
    });
}