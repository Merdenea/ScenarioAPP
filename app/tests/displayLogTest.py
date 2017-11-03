# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class DisplayLogTest(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:3000"
        self.verificationErrors = []
        self.accept_next_alert = True
        driver = self.driver
        driver.get(self.base_url + "/users/login")
        driver.find_element_by_name("username").clear()
        driver.find_element_by_name("username").send_keys("MK3")
        driver.find_element_by_name("password").clear()
        driver.find_element_by_name("password").send_keys("123")
        driver.find_element_by_css_selector("input.btn.btn-primary").click()
    
    def test_display_log(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_css_selector("body > div > ul > li:nth-child(1) > a").click()
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "h3"))
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "p"))
        self.assertTrue(self.is_element_present(By.CSS_SELECTOR, "body > div.container"))
        driver.find_element_by_link_text("Home").click()
    
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
