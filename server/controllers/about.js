module.exports = function(req, res, next) {
    res.render('generic', {
        title: 'About | Medical Lab Management System',
        pageHeader: 'About Medical Lab Management System',
        pageBody: `Medical lab app helps labs maintain patient information &amp; information regarding lab tests, packages and reports online.
            <br /><br />
            Sit ullamco cupidatat fugiat ex exercitation. Esse deserunt ullamco nulla veniam enim quis laborum proident reprehenderit officia occaecat excepteur aliquip aliquip. Ipsum quis duis ut pariatur et nisi nulla quis tempor ipsum do dolore laboris.`
    });
};