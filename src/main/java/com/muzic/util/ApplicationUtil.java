package com.muzic.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;



public class ApplicationUtil {

	public static String getDateFormatKey(LocalDate localDate) {
		return localDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
	}
	
	
	public static void main(String[] args) {
		System.out.println(ApplicationUtil.getDateFormatKey(LocalDate.now()));
	}
}
