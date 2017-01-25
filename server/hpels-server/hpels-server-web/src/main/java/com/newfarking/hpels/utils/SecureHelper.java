package com.newfarking.hpels.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SecureHelper {

    static Logger log = LoggerFactory.getLogger(SecureHelper.class);
	/**
	 * @param input string
	 * @return string
	 */
	public static String MD5(String input) {
		String sRet = null;
		String[] hexDigits = {"0", "1", "2", "3", "4", 
				"5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"}; 
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] results = md.digest(input.getBytes());
			StringBuffer resultSb = new StringBuffer();    
			for (int i = 0; i < results.length; i++){
				byte b = results[i];
				int n = b;
				if (n < 0) {
					n = 256 + n;
				}
				int d1 = n / 16;    
				int d2 = n % 16;				
				resultSb.append(hexDigits[d1] + hexDigits[d2]);    
			}
			sRet = resultSb.toString();
		} catch(NoSuchAlgorithmException e) {
			log.error("system does not support MD5 Algorithm");	
		}
		return sRet;
	}
}
