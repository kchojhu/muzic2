package com.muzic.model;

import java.io.Serializable;

public class JsonResponse implements Serializable {
	private Boolean success = true;
	private String error;

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

}
