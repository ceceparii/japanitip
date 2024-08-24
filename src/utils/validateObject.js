export function validateObject(obj){
    let errors = []

    Object.keys(obj).map((key) => {
        if (!obj[key]) {
            errors.push(key)
        }
    })

    return errors
}