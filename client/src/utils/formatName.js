export const formatName = (user) => {
    let fname = user?.firstName?.at(0)?.toUpperCase() + user?.firstName?.slice(1)?.toLowerCase()
    let lname = user?.lastName?.at(0)?.toUpperCase() + user?.lastName?.slice(1)?.toLowerCase()
    return fname +" "+lname

}