const {Builder, By, until} = require('selenium-webdriver');

let driver = new Builder()
    .forBrowser('firefox')
    .build();
driver.get('http://localhost:3000/');
driver.findElement(By.name('username')).sendKeys('vlad');
driver.findElement(By.name('password')).sendKeys('1234');
driver.findElement(By.name('$0')).click();