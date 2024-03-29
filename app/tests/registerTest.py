# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re, random

class RegisterAnAcc(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:3000"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_register_an_acc(self):
        a = random.randint(-9999, 9999)
        driver = self.driver
        driver.get(self.base_url + "/users/register")
        driver.find_element_by_name("name").clear()
        driver.find_element_by_name("name").send_keys("MK3" + str(a))
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys(str(a) + "asdfkjhkl@qwq.com")
        driver.find_element_by_name("username").clear()
        driver.find_element_by_name("username").send_keys("MK3")
        driver.find_element_by_name("password").clear()
        driver.find_element_by_name("password").send_keys("123")
        driver.find_element_by_name("password2").clear()
        driver.find_element_by_name("password2").send_keys("123")
        driver.find_element_by_css_selector("input.btn.btn-primary").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "div.alert.alert-success"))
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True
    
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
