const cfonts = require('cfonts');
module.exports = (text) => {
    const banner = cfonts.render((text), {
        align: 'left',
        letterSpacing: 1,
        lineHeight: 1
    });
    console.log(banner.string)
    return 
}