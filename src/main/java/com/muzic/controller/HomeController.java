package com.muzic.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@RequestMapping("/")
	public String index() {
		System.out.println("test");
		return "redirect:/dist/index.html";
	}

	@RequestMapping("/index.html")
	public String index2() {
		System.out.println("test");
		return "redirect:/dist/index.html";
	}	
	
}
