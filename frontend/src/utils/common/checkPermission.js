export const checkPermission = ({ userDetails, content }) => {
  if (userDetails?.purchasedContent?.includes(content._id)) {
    return true;
  }
  if (
    content?.permission?.usersWithAccess?.some(
      (user) => user._id === userDetails?.id
    )
  ) {
    return true;
  } else if (
    content?.permission?.groupsWithAccess?.includes(userDetails?.role)
  ) {
    return true;
  } else if (content?.author === userDetails?.id) {
    return true;
  } else {
    return false;
  }
};
