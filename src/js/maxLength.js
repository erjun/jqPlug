(function($) {
	var MaxLength = function(el) {
		this.$el = $(el);
		this.$textarea = this.$el.find("textarea");
		this.$tip = this.$el.find(".tip");
		this.maxLength = 280;
		this.maxLenghtTxt = this.maxLength / 2;
		this.isOver = false;
		this.addstr = "";
		this.str_len = function(str) {
			return str.match(/[^ -~]/g) == null ? str.length: (str.length + str.match(/[^ -~]/g).length);
		};
		var self = this;
		this.detection = function() {
			var len = self.str_len($.trim(self.$textarea.val())),
			diffLen = self.maxLength - len,
			deDiffLen = len - self.maxLength;
			if (diffLen >= 0) {
				self.$tip.css({
					color: ""
				});
				if (self.isOver) {
					self.$tip.html("还可以输入<em></em>字")
				}
				self.isOver = false;
				self.$tip.find("em").text(parseInt(diffLen / 2));
			} else {
				self.$tip.css({
					color: "red"
				});
				self.$tip.html("您的评论超出了" + self.maxLenghtTxt + "字还多(<em></em>)字,请删除后发表");
				self.isOver = true;
				self.$tip.find("em").text(parseInt(deDiffLen / 2));
			}
		}
		this.$textarea.bind('keyup', this.detection);
		this.detection();
		return this;
	}
	$.fn.maxLength = function() {
		return new MaxLength(this);
	}
})(window.jQuery);

